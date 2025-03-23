import type { User } from "../../domain/user";

export abstract class ReadAuthRepositoryPort {
  abstract find(): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<void>;
}
