import { Inject } from "@nestjs/common";
import { WriteAuthRepositoryPort } from "../../application/ports/write-auth.repository";
import { DRIZZLE } from "src/db/database.module";
import { user } from "../entities/user";
import { UserMapper } from "../mappers/user.mapper";
import type { User } from "../../domain/user";
import { DrizzleDB } from "src/db/types/drizzle";
import { eq } from "drizzle-orm";

export class WriteAuthRepository implements WriteAuthRepositoryPort {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async save(userData: User): Promise<void> {
    const userPersistence = UserMapper.toPersistence(userData);
    await this.db.insert(user).values(userPersistence);
  }

  async update(userData: User) {
    await this.db
      .update(user)
      .set({ ...userData })
      .where(eq(user.email, userData.email));
  }

  async delete(): Promise<void> {}
}
