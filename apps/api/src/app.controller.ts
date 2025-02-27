import { Controller, Get, Inject } from "@nestjs/common";
import type { AppService } from "./app.service";
import { APP_SERVICE } from "./di-tokens";

@Controller()
export class AppController {
  constructor(@Inject(APP_SERVICE) private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
