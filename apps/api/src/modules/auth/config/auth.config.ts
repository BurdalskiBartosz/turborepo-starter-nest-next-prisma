import { ConfigService } from "@nestjs/config";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  AuthConfigSchema,
  type AuthConfig,
  type SessionConfig,
  type RedisConfig,
  type GoogleConfig,
} from "./auth.config-schema";

@Injectable()
export class AuthConfigService implements OnModuleInit {
  private readonly logger = new Logger(AuthConfigService.name);
  private config: AuthConfig;
  private initialized = false;

  constructor(private configService: ConfigService) {
    this.initializeConfig();
  }
  onModuleInit() {
    if (!this.initialized) {
      this.initializeConfig();
    }
    this.logger.log("AuthConfigService initialized in onModuleInit");
  }

  initializeConfig() {
    try {
      const rawConfig = {
        session: {
          secret: this.configService.get<string>("SESSION_SECRET"),
          resave: this.configService.get<boolean>("SESSION_RESAVE", false),
          saveUninitialized: this.configService.get<boolean>(
            "SESSION_SAVE_UNINITIALIZED",
            false,
          ),
          cookie: {
            sameSite: this.configService.get<
              SessionConfig["cookie"]["sameSite"]
            >("SESSION_COOKIE_SAME_SITE", true),
            httpOnly: this.configService.get<boolean>(
              "SESSION_COOKIE_HTTP_ONLY",
              true,
            ),
            secure: this.configService.get<boolean>(
              "SESSION_COOKIE_SECURE",
              process.env.NODE_ENV === "production",
            ),
            maxAge: this.configService.get<number>("SESSION_COOKIE_MAX_AGE"),
          },
        },
        redis: {
          host: this.configService.get<string>("REDIS_HOST", "redis"),
          port: Number(this.configService.get<number>("REDIS_PORT", 6379)),
          prefix: this.configService.get<string>("REDIS_PREFIX", "myapp:"),
        },
        google: {
          clientId: this.configService.get<string>("GOOGLE_CLIENT_ID"),
          clientSecret: this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
        },
      };

      const result = AuthConfigSchema.safeParse(rawConfig);

      if (!result.success) {
        const formattedErrors = result.error.format();
        this.logger.error(
          `Authorization configuration validation errors: ${JSON.stringify(formattedErrors)}`,
        );
        throw new Error("Incorrect authorization configuration");
      }

      this.config = result.data;

      this.initialized = true;
      this.logger.log("Authorization configuration loaded correctly");
    } catch (error) {
      this.logger.error(
        `Could not load authorization configuration: ${error.message}`,
      );
      throw error;
    }
  }

  getSessionConfig(): SessionConfig {
    return this.config.session;
  }

  getRedisConfig(): RedisConfig {
    return this.config.redis;
  }

  getGoogleConfig(): GoogleConfig {
    return this.config.google;
  }
}
