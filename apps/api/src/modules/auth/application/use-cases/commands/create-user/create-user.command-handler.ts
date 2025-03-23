import { CreateUserCommand } from "./create-user.command";
import { CommandHandler, QueryBus, type ICommandHandler } from "@nestjs/cqrs";
import { UserFactory } from "src/modules/auth/domain/factories/user-factory";
import { WriteAuthRepositoryPort } from "../../../ports/write-auth.repository";
import { GetUserByEmailQuery } from "../../queries/get-user-by-email/get-user-by-email.query";
import { HashingService } from "../../../hashing/hashing.service.abstract";
import { UserAlreadyExistsException } from "src/common/exceptions/auth/user-already-exists.exception";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly userFactory: UserFactory,
    private readonly writeAuthRepository: WriteAuthRepositoryPort,
    private readonly queryBus: QueryBus,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: CreateUserCommand) {
    const userExists = await this.queryBus.execute(
      new GetUserByEmailQuery(command.email),
    );

    if (userExists) {
      throw new UserAlreadyExistsException(userExists.email);
    }

    const hashedPassword = await this.hashingService.hash(command.password);

    const user = this.userFactory.create(command.email, hashedPassword, null);
    await this.writeAuthRepository.save(user);

    return true;
  }
}
