import { Query } from "@nestjs/cqrs";
import { User } from "src/modules/auth/domain/user";

export class GetUserByEmailQuery extends Query<User | null> {
  constructor(public readonly email: string) {
    super();
  }
}
