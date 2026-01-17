import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { models as modelsSchema, tours as toursSchema } from "@shared/schema";
import { z } from "zod";
import { getHeritageDetails, getHeritageSites } from "./gemini";
import path from 'path';
import fs from 'fs';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // 3D Models API routes
  app.get("/api/models", async (req, res, next) => {
    try {
      const models = await storage.getAllModels();
      res.json(models);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/models/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid model ID" });
      }
      
      const model = await storage.getModel(id);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      res.json(model);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/models", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const newModel = {
        ...req.body,
        userId: req.user.id,
        createdAt: new Date().toISOString()
      };
      
      const model = await storage.createModel(newModel);
      res.status(201).json(model);
    } catch (error) {
      next(error);
    }
  });

  // Virtual Tours API routes
  app.get("/api/tours", async (req, res, next) => {
    try {
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tours/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      
      const tour = await storage.getTour(id);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      
      res.json(tour);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/tours", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const tour = await storage.createTour(req.body);
      res.status(201).json(tour);
    } catch (error) {
      next(error);
    }
  });

  // Special route to serve 3D model files and textures
  app.get("/api/modelfiles/:filename", (req, res, next) => {
    try {
      const filename = req.params.filename;
      
      // First check for model files in /public/models
      let filePath = path.join(process.cwd(), 'public', 'models', filename);
      
      // If file not found in models directory, check if it's a texture in /public
      if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), 'public', filename);
      }
      
      // Check in attached_assets as well if file was not found elsewhere
      if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), 'attached_assets', filename);
      }
      
      console.log(`Attempting to serve 3D model file or texture: ${filePath}`);
      
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        console.error(`File not found: ${filePath}`);
        res.status(404).json({ message: "File not found", searchedPaths: [
          path.join(process.cwd(), 'public', 'models'),
          path.join(process.cwd(), 'public'),
          path.join(process.cwd(), 'attached_assets')
        ]});
      }
    } catch (error) {
      next(error);
    }
  });

  // Heritage Monuments Assistant API routes
  app.get("/api/heritage/sites", async (req, res, next) => {
    try {
      const sites = getHeritageSites();
      res.json(sites);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/heritage/details", async (req, res, next) => {
    try {
      const { site } = req.body;
      
      if (!site) {
        return res.status(400).json({ 
          error: 'Missing site parameter' 
        });
      }
      
      const details = await getHeritageDetails(site);
      res.json(details);
    } catch (error) {
      next(error);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
