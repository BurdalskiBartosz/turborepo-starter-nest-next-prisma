import {
  Injectable,
  UnauthorizedException,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { WriteAuthRepositoryPort } from "./ports/write-auth.repository";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "./use-cases/queries/get-user-by-email/get-user-by-email.query";
import { CreateUserViaGoogleCommand } from "./use-cases/commands/create-user-via-google/create-user-via-google.command";
import { AuthConfigService } from "../config/auth.config";

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly writeAuthRepository: WriteAuthRepositoryPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly authConfigService: AuthConfigService,
  ) {}

  onModuleInit() {
    const googleConfig = this.authConfigService.getGoogleConfig();
    const clientId = googleConfig.clientId;
    const clientSecret = googleConfig.clientSecret;

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string) {
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: token,
    });
    const payload = loginTicket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException("No email in payload");
    }

    let user = await this.queryBus.execute(
      new GetUserByEmailQuery(payload.email),
    );

    if (!user) {
      user = await this.commandBus.execute(
        new CreateUserViaGoogleCommand(payload.email, payload.sub),
      );
    } else if (!user.googleId) {
      user.assingGoogleId(payload.sub);
      await this.writeAuthRepository.update(user);
    }

    return user;
  }
}
