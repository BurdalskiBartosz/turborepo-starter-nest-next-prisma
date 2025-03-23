import { User } from "../../domain/user";
import type { InsertUser, SelectUser } from "../entities/user";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
  static toPersistence(user: User): InsertUser {
    return {
      ...user,
      email: user.email,
      passwordHash: user.passwordHash,
    };
  }

  static toDomain(user: SelectUser): User {
    const model = new User(
      user.id,
      user.email,
      user.passwordHash,
      user.googleId,
    );

    return model;
  }
}
