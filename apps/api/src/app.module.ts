import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { APP_SERVICE } from "./di-tokens";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [{ provide: APP_SERVICE, useClass: AppService }, PrismaService],
})
export class AppModule {}
