import { type IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { User } from "src/modules/auth/domain/user";
import { GetUserQuery } from "./get-user.query";
import { UnauthorizedException } from "@nestjs/common";
import { ReadAuthRepositoryPort } from "../../../ports/read-auth.repository";
import { HashingService } from "../../../hashing/hashing.service.abstract";
import { InvalidCredentialsException } from "src/common/exceptions/auth/invalid-credentials.exception";

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, User | null>
{
  constructor(
    private readonly readAuthRepository: ReadAuthRepositoryPort,
    private readonly hashingService: HashingService,
  ) {}

  async execute(query: GetUserQuery): Promise<User | null> {
    const user = await this.readAuthRepository.findByEmail(query.email);

    if (!user) {
      throw new UnauthorizedException("User does not exists");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException("User account created via provider");
    }

    const isPasswordValid = await this.hashingService.compare(
      query.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
