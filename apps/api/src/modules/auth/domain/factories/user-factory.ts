import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { User } from "../user";

@Injectable()
export class UserFactory {
  create(
    email: string,
    passwordHash: string | null,
    googleId: string | null,
  ): User {
    const id = randomUUID();

    const user = new User(id, email, passwordHash, googleId);

    return user;
  }
}
