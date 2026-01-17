import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Heritage sites list
const HERITAGE_SITES = [
  "victoria memorial", "tanjavur temple", "tajmahal", "Sun Temple Konark",
  "qutub_minar", "mysore_palace", "lotus_temple", "khajuraho", "jamali_kamali_tomb",
  "iron_pillar", "india gate", "Humayun's Tomb", "hawa mahal",
  "golden temple", "Gateway of India", "Fatehpur Sikri", "Ellora Caves",
  "Chhota Imambara", "charminar", "Charar-E-Sharif", "basilica of bom jesus",
  "alai_minar", "alai_darwaza", "Ajanta Caves"
];

// Check if the API key is set
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("GOOGLE_API_KEY is not set in environment variables");
}

// Initialize the Gemini API with safety settings
let genAI: GoogleGenerativeAI | null = null;

try {
  genAI = new GoogleGenerativeAI(API_KEY || "");
  console.log("Gemini API initialized successfully");
} catch (error) {
  console.error("Failed to initialize Gemini API:", error);
}

/**
 * Get historical details about a heritage site
 */
export async function getHeritageDetails(site: string): Promise<{ content: string }> {
  try {
    if (!genAI) {
      return { 
        content: "API not initialized. Please check your API key." 
      };
    }

    // Normalize site name
    const siteName = site.toLowerCase().trim();
    
    // Create a more specific prompt for heritage sites
    const prompt = `Provide a detailed historical overview of the ${siteName.replace('_', ' ')}, 
      including its origin, architectural significance, historical events, and cultural importance. 
      Format the response with these sections:
      - Brief Introduction (1-2 sentences)
      - Historical Origin (when it was built, by whom)
      - Architectural Features (key design elements)
      - Cultural Significance (importance to local culture)
      - Interesting Facts (2-3 unique facts)
      
      Keep the response informative and concise, around 300-400 words total.
      If the site is not recognized as an Indian heritage monument, suggest similar heritage sites from India.`;

    // Generate response using the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return { content: response.text() };
  } catch (error) {
    console.error("Error getting heritage details:", error);
    return { 
      content: `Sorry, I encountered an error while retrieving information. Please check your API key or try again later. Error: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Get a list of available heritage sites
 */
export function getHeritageSites(): { sites: string[] } {
  return { sites: HERITAGE_SITES };
}