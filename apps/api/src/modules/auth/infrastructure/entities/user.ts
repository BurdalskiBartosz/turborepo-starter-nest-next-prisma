import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }),
  googleId: varchar({ length: 255 }),
});

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
