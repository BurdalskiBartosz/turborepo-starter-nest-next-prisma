import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
  constructor(private readonly db: PrismaService) {}
  async getHello() {
    const users = await this.db.user.findMany();
    console.log(users);
    return "Hello World!";
  }
}
