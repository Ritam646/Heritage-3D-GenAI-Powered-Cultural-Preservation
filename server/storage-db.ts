import { users, type User, type InsertUser, models, tours, type Model, type Tour } from "@shared/schema";
import session from "express-session";
import { eq } from "drizzle-orm";
import { db, pool } from "./db";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// Import the IStorage interface
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type to avoid compatibility issues

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllModels(): Promise<Model[]> {
    return await db.select().from(models);
  }

  async getModel(id: number): Promise<Model | undefined> {
    const [model] = await db.select().from(models).where(eq(models.id, id));
    return model || undefined;
  }

  async createModel(model: any): Promise<Model> {
    const [newModel] = await db
      .insert(models)
      .values(model)
      .returning();
    return newModel;
  }

  async updateModel(id: number, modelData: Partial<Model>): Promise<Model | undefined> {
    const [updatedModel] = await db
      .update(models)
      .set(modelData)
      .where(eq(models.id, id))
      .returning();
    return updatedModel || undefined;
  }

  async deleteModel(id: number): Promise<boolean> {
    const result = await db
      .delete(models)
      .where(eq(models.id, id));
    return true; // Assuming success if no error is thrown
  }

  async getAllTours(): Promise<Tour[]> {
    return await db.select().from(tours);
  }

  async getTour(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour || undefined;
  }

  async createTour(tour: any): Promise<Tour> {
    const [newTour] = await db
      .insert(tours)
      .values(tour)
      .returning();
    return newTour;
  }

  async updateTour(id: number, tourData: Partial<Tour>): Promise<Tour | undefined> {
    const [updatedTour] = await db
      .update(tours)
      .set(tourData)
      .where(eq(tours.id, id))
      .returning();
    return updatedTour || undefined;
  }

  async deleteTour(id: number): Promise<boolean> {
    const result = await db
      .delete(tours)
      .where(eq(tours.id, id));
    return true; // Assuming success if no error is thrown
  }
}