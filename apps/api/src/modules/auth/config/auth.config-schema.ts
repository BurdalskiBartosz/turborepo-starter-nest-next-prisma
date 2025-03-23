import { z } from "zod";

export const SessionConfigSchema = z.object({
  secret: z.string().min(10),
  resave: z.boolean().default(false),
  saveUninitialized: z.boolean().default(false),
  cookie: z.object({
    sameSite: z
      .union([
        z.boolean(),
        z.literal("lax"),
        z.literal("strict"),
        z.literal("none"),
      ])
      .default(true),
    httpOnly: z.boolean().default(true),
    secure: z.boolean().default(process.env.NODE_ENV === "production"),
    maxAge: z.number().optional(),
  }),
});

export const RedisConfigSchema = z.object({
  host: z.string().default("redis"),
  port: z.number().int().positive().default(6379),
  prefix: z.string().default("myapp:"),
});

export const GoogleConfigSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
});

export const AuthConfigSchema = z.object({
  session: SessionConfigSchema,
  redis: RedisConfigSchema,
  google: GoogleConfigSchema,
});

export type SessionConfig = z.infer<typeof SessionConfigSchema>;
export type RedisConfig = z.infer<typeof RedisConfigSchema>;
export type GoogleConfig = z.infer<typeof GoogleConfigSchema>;

export type AuthConfig = z.infer<typeof AuthConfigSchema>;
