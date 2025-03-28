import { Module } from "@nestjs/common";
import { PrismaService } from "./db/prisma.service";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
