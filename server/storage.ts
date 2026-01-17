import { users, type User, type InsertUser, models, tours, type Model, type Tour } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with CRUD methods needed
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Model methods
  getAllModels(): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  createModel(model: any): Promise<Model>;
  updateModel(id: number, model: Partial<Model>): Promise<Model | undefined>;
  deleteModel(id: number): Promise<boolean>;
  
  // Tour methods
  getAllTours(): Promise<Tour[]>;
  getTour(id: number): Promise<Tour | undefined>;
  createTour(tour: any): Promise<Tour>;
  updateTour(id: number, tour: Partial<Tour>): Promise<Tour | undefined>;
  deleteTour(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private modelsData: Map<number, Model>;
  private toursData: Map<number, Tour>;
  
  sessionStore: session.SessionStore;
  currentId: number;
  currentModelId: number;
  currentTourId: number;

  constructor() {
    this.users = new Map();
    this.modelsData = new Map();
    this.toursData = new Map();
    
    this.currentId = 1;
    this.currentModelId = 1;
    this.currentTourId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Add some initial data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Model methods
  async getAllModels(): Promise<Model[]> {
    return Array.from(this.modelsData.values());
  }
  
  async getModel(id: number): Promise<Model | undefined> {
    return this.modelsData.get(id);
  }
  
  async createModel(model: any): Promise<Model> {
    const id = this.currentModelId++;
    const newModel: Model = { ...model, id };
    this.modelsData.set(id, newModel);
    return newModel;
  }
  
  async updateModel(id: number, modelData: Partial<Model>): Promise<Model | undefined> {
    const model = this.modelsData.get(id);
    if (!model) return undefined;
    
    const updatedModel = { ...model, ...modelData };
    this.modelsData.set(id, updatedModel);
    return updatedModel;
  }
  
  async deleteModel(id: number): Promise<boolean> {
    return this.modelsData.delete(id);
  }
  
  // Tour methods
  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.toursData.values());
  }
  
  async getTour(id: number): Promise<Tour | undefined> {
    return this.toursData.get(id);
  }
  
  async createTour(tour: any): Promise<Tour> {
    const id = this.currentTourId++;
    const newTour: Tour = { ...tour, id };
    this.toursData.set(id, newTour);
    return newTour;
  }
  
  async updateTour(id: number, tourData: Partial<Tour>): Promise<Tour | undefined> {
    const tour = this.toursData.get(id);
    if (!tour) return undefined;
    
    const updatedTour = { ...tour, ...tourData };
    this.toursData.set(id, updatedTour);
    return updatedTour;
  }
  
  async deleteTour(id: number): Promise<boolean> {
    return this.toursData.delete(id);
  }
  
  private seedData() {
    // Seed models data
    const seedModels = [
      {
        id: this.currentModelId++,
        name: "Taj Mahal",
        description: "Built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this ivory-white marble mausoleum is one of the world's most iconic monuments.",
        location: "Agra, Uttar Pradesh",
        userId: 1,
        modelUrl: "/models/Tajmahal_model_2.obj",
        imageUrl: "/images/photo-1564507592333-c60657eea523.jpeg",
        createdAt: "2023-01-01"
      },
      {
        id: this.currentModelId++,
        name: "Qutub Minar",
        description: "A soaring 73-meter minaret built in the early 13th century, featuring intricate carvings and inscriptions from the Delhi Sultanate period.",
        location: "Delhi, India",
        userId: 1,
        modelUrl: "/models/Qutub_Minar_3d_Model.obj",
        imageUrl: "/images/qutub1_042717100950.jpg",
        createdAt: "2023-01-02"
      },
      {
        id: this.currentModelId++,
        name: "Hawa Mahal",
        description: "Known as the \"Palace of Winds,\" this five-story palace features 953 small windows decorated with intricate latticework.",
        location: "Jaipur, Rajasthan",
        userId: 1,
        modelUrl: "/models/hawa-mahal.glb",
        imageUrl: "https://images.unsplash.com/photo-1590733840202-2419ecf9b2e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        createdAt: "2023-01-03"
      }
    ];
    
    // Seed tours data
    const seedTours = [
      {
        id: this.currentTourId++,
        name: "Taj Mahal: Moonlight Tour",
        description: "Experience the breathtaking beauty of the Taj Mahal under moonlight. This virtual tour takes you through the marble mausoleum and its gardens when they're bathed in the ethereal glow of the moon.",
        location: "Agra, Uttar Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        rating: "4.8",
        reviewCount: 240,
        featured: true
      },
      {
        id: this.currentTourId++,
        name: "Ellora Caves",
        description: "Explore the ancient rock-cut temples of Ellora, showcasing Buddhist, Hindu, and Jain monuments from the 6th-10th century CE.",
        location: "Aurangabad, Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1602313306079-c96725738c58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        rating: "4.6",
        reviewCount: 180,
        featured: false
      },
      {
        id: this.currentTourId++,
        name: "Mysore Palace",
        description: "Take a virtual tour through the magnificent Mysore Palace, one of India's most visited attractions known for its Indo-Saracenic architecture.",
        location: "Mysore, Karnataka",
        imageUrl: "https://images.unsplash.com/photo-1592635196078-9fbb53ab45e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        rating: "4.7",
        reviewCount: 210,
        featured: false
      }
    ];
    
    // Add models to storage
    seedModels.forEach(model => {
      this.modelsData.set(model.id, model);
    });
    
    // Add tours to storage
    seedTours.forEach(tour => {
      this.toursData.set(tour.id, tour);
    });
  }
}

// Import the DatabaseStorage implementation
import { DatabaseStorage } from "./storage-db";

// Use DatabaseStorage instead of MemStorage for production
export const storage = new DatabaseStorage();
