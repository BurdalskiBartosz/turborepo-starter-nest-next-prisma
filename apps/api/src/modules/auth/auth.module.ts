import {
  type MiddlewareConsumer,
  type NestModule,
  Module,
} from "@nestjs/common";
import { AuthController } from "./presenters/auth.controller";
import { AuthInfrastructureModule } from "./infrastructure/auth-infrastructure.module";
import { AuthService } from "./application/auth.service";
import { UserFactory } from "./domain/factories/user-factory";
import { CreateUserCommandHandler } from "./application/use-cases/commands/create-user/create-user.command-handler";
import { GetUserByEmailQueryHandler } from "./application/use-cases/queries/get-user-by-email/get-user-by-email.query-handler";
import { HashingService } from "./application/hashing/hashing.service.abstract";
import { ScryptService } from "./application/hashing/scrypt.service";
import * as session from "express-session";
import * as passport from "passport";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import { UserSerializer } from "./infrastructure/serializers/user.serializer";
import { GetUserQueryHandler } from "./application/use-cases/queries/get-user/get-user.query-handler";
import { GoogleAuthService } from "./application/google-auth.service";
import { AuthConfigService } from "./config/auth.config";
import { CreateUserViaGoogleCommandHandler } from "./application/use-cases/commands/create-user-via-google/create-user-via-google.command-handler";

@Module({
  controllers: [AuthController],
  imports: [AuthInfrastructureModule],
  providers: [
    { provide: HashingService, useClass: ScryptService },
    AuthConfigService,
    GoogleAuthService,
    AuthService,
    UserFactory,
    CreateUserCommandHandler,
    CreateUserViaGoogleCommandHandler,
    GetUserByEmailQueryHandler,
    GetUserQueryHandler,
    UserSerializer,
  ],
  exports: [AuthConfigService],
})
export class AuthModule implements NestModule {
  constructor(private readonly authConfigService: AuthConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    const redisConfig = this.authConfigService.getRedisConfig();
    const sessionConfig = this.authConfigService.getSessionConfig();

    const redisClient = new Redis(redisConfig.port, redisConfig.host);

    const redisStore = new RedisStore({
      client: redisClient,
      prefix: redisConfig.prefix,
    });

    consumer
      .apply(
        session({
          store: redisStore,
          secret: sessionConfig.secret,
          resave: sessionConfig.resave,
          saveUninitialized: sessionConfig.saveUninitialized,
          cookie: sessionConfig.cookie,
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes("*");
  }
}
