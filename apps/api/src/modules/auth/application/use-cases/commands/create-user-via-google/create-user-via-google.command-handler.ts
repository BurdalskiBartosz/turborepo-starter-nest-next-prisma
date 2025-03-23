import { CommandHandler, QueryBus, type ICommandHandler } from "@nestjs/cqrs";
import { UserFactory } from "src/modules/auth/domain/factories/user-factory";
import { WriteAuthRepositoryPort } from "../../../ports/write-auth.repository";
import { CreateUserViaGoogleCommand } from "./create-user-via-google.command";
import type { User } from "src/modules/auth/domain/user";

@CommandHandler(CreateUserViaGoogleCommand)
export class CreateUserViaGoogleCommandHandler
  implements ICommandHandler<CreateUserViaGoogleCommand>
{
  constructor(
    private readonly userFactory: UserFactory,
    private readonly writeAuthRepository: WriteAuthRepositoryPort,
  ) {}

  async execute(command: CreateUserViaGoogleCommand): Promise<User> {
    const user = this.userFactory.create(command.email, null, command.googleId);
    await this.writeAuthRepository.save(user);

    return user;
  }
}
