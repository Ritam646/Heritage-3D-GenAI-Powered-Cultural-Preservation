import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";

// Create database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
  try {
    console.log("Creating tables...");
    
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        profile_image TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Users table created");
    
    // Create models table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS models (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        model_url TEXT,
        image_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Models table created");
    
    // Create tours table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        rating TEXT,
        review_count INTEGER,
        featured BOOLEAN
      );
    `);
    console.log("✅ Tours table created");
    
    console.log("✅ All tables created successfully!");
    
    // Insert sample data for models
    await db.execute(`
      INSERT INTO models (name, description, location, user_id, model_url, image_url, created_at)
      VALUES 
        ('Taj Mahal', 'One of the seven wonders of the world, built by Emperor Shah Jahan in memory of his beloved wife.', 'Agra, Uttar Pradesh', 1, 'Tajmahal_model_2.obj', '/images/tajmahal.jpg', CURRENT_TIMESTAMP),
        ('Qutub Minar', 'The tallest brick minaret in the world, built in the early 13th century.', 'Delhi', 1, 'Qutub_Minar_3d_Model.obj', '/images/qutubminar.jpg', CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✅ Sample models inserted");
    
    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

main();