import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly db: PrismaService) {}
  async getHello() {
    const user = await this.db.user.findMany();
    const xd = await this.db.test.findFirst();
    console.log(user, xd);
    return 'Hello World!';
  }
}
