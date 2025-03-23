import { Inject } from "@nestjs/common";
import type { ReadAuthRepositoryPort } from "../../application/ports/read-auth.repository";
import type { User } from "../../domain/user";
import { DRIZZLE } from "src/db/database.module";
import type { DrizzleDB } from "src/db/types/drizzle";
import { user } from "../entities/user";
import { eq } from "drizzle-orm";
import { UserMapper } from "../mappers/user.mapper";

export class ReadAuthRepository implements ReadAuthRepositoryPort {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async find(): Promise<void> {}

  async findByEmail(email: string): Promise<User | null> {
    const [entity] = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!entity) {
      return null;
    }

    return UserMapper.toDomain(entity);
  }

  async findAll(): Promise<void> {}
}
