import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { GetUserDto } from "./dto/get-user.dto";
import type { Request } from "express";
import { Public } from "../decorators/public.decorator";
import { promisify } from "node:util";
import { CreateUserCommand } from "../application/use-cases/commands/create-user/create-user.command";
import { GetUserQuery } from "../application/use-cases/queries/get-user/get-user.query";
import { AuthService } from "../application/auth.service";
import { GoogleAuthService } from "../application/google-auth.service";

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() getUserDto: GetUserDto,
    @Req() req: Request,
  ): Promise<{ token: string }> {
    const user = await this.authService.getUser(
      new GetUserQuery(getUserDto.email, getUserDto.password),
    );
    await promisify(req.login).call(req, user);

    return {
      token: req.sessionID,
    };
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    await this.authService.create(
      new CreateUserCommand(createUserDto.email, createUserDto.password),
    );

    return true;
  }

  @Post("google")
  async googleLogin(@Body() body: { idToken: string }, @Req() req: Request) {
    const user = await this.googleAuthService.authenticate(body.idToken);

    await promisify(req.login).call(req, user);

    return {
      token: req.sessionID,
      user: {
        ...user,
      },
    };
  }
}
