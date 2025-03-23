import type { User } from "../../domain/user";

export abstract class WriteAuthRepositoryPort {
  abstract save(userData: User): Promise<void>;
  abstract update(userData: User): Promise<void>;
  abstract delete(): Promise<void>;
}
