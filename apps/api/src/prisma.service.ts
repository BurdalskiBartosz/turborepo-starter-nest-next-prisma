import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@repo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('test');
    await this.$connect();
  }
}
