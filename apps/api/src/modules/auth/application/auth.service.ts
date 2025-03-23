import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "./use-cases/commands/create-user/create-user.command";
import { GetUserQuery } from "./use-cases/queries/get-user/get-user.query";

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getUser(getUserQuery: GetUserQuery) {
    const user = await this.queryBus.execute(getUserQuery);
    return user;
  }

  async create(createUserCommand: CreateUserCommand) {
    await this.commandBus.execute(createUserCommand);

    return null;
  }
}
