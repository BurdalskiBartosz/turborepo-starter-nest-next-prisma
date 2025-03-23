import { Module } from "@nestjs/common";
import { ReadAuthRepositoryPort } from "../application/ports/read-auth.repository";
import { ReadAuthRepository } from "./repositories/read-auth.repository";
import { WriteAuthRepositoryPort } from "../application/ports/write-auth.repository";
import { WriteAuthRepository } from "./repositories/write-auth.repository";
import { DatabaseModule } from "src/db/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ReadAuthRepositoryPort,
      useClass: ReadAuthRepository,
    },
    {
      provide: WriteAuthRepositoryPort,
      useClass: WriteAuthRepository,
    },
  ],

  exports: [ReadAuthRepositoryPort, WriteAuthRepositoryPort],
})
export class AuthInfrastructureModule {}
