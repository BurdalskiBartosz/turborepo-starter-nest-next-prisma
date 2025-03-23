import { Command } from "@nestjs/cqrs";
import type { User } from "src/modules/auth/domain/user";

export class CreateUserViaGoogleCommand extends Command<User> {
  constructor(
    public readonly email: string,
    public readonly googleId: string,
  ) {
    super();
  }
}
