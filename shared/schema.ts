import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  userId: integer("user_id").notNull(),
  modelUrl: text("model_url"),
  imageUrl: text("image_url"),
  year: text("year"),
  style: text("style"),
  material: text("material"),
  featured: boolean("featured"),
  createdAt: text("created_at").notNull(),
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating"),
  reviewCount: integer("review_count"),
  featured: boolean("featured"),
  duration: text("duration"),
  availability: text("availability"),
  groupSize: text("group_size"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    name: true,
    email: true,
    profileImage: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

export const insertModelSchema = createInsertSchema(models).omit({
  id: true,
  userId: true,
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Model = typeof models.$inferSelect;
export type Tour = typeof tours.$inferSelect;
