import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly db: PrismaService) {}
  getHello(): string {
    const user = this.db.user.findMany();
    console.log(user);
    return 'Hello World!';
  }
}
