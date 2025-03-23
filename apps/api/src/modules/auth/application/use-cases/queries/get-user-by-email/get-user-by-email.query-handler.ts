import { type IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "./get-user-by-email.query";
import { ReadAuthRepositoryPort } from "../../../ports/read-auth.repository";
import type { User } from "src/modules/auth/domain/user";

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler
  implements IQueryHandler<GetUserByEmailQuery, User | null>
{
  constructor(private readonly readAuthRepository: ReadAuthRepositoryPort) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    const user = await this.readAuthRepository.findByEmail(query.email);
    return user;
  }
}
