import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI Travel Assistant endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    // Build contents matching @google/genai guidelines
    const formattedContents = [];
    
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.content }],
        });
      }
    }
    
    // Add current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message || "Hello" }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: "You are the StayLux Elite Concierge AI Assistant. Your mission is to provide ultra-luxury concierge recommendation, travel tips, and packing guidelines. Keep your responses exceptionally sophisticated, refined, helpful, and premium.",
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, but I am unable to connect with the StayLux booking registry at this moment. How else may I serve you today?";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// AI Hotel Recommendation endpoint (Structured JSON Output)
app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { prompt } = req.body;

    const systemInstruction = 
      "You are the StayLux Elite Recommendations Engine. Analyze the user's requirements (e.g. style of travel, hot springs, family layout, snowy peaks, infinity pools, active budgets, or romantic verandas) and select the absolute best matching hotel from our curated list of luxury properties. Our valid hotel IDs are: 'santorini-grand' (The Grand Horizon Resort), 'kyoto-sanctuary' (Kyoto Bamboo Sanctuary Onsen), 'alpine-whisper' (Alpine Whisper Ski Chalet), 'maldives-luminary' (The Luminary Overwater Atoll), 'morocco-sandsara' (Sandsara Sacred Oasis), and 'newyork-vanderbilt' (The Vanderbilt Regency). Evaluate a match percentage and 3 precise reasons emphasizing why it is a masterclass in travel design.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Find the perfect luxury stay recommendation for: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["hotelId", "matchPercentage", "matchReasons", "personalizedMessage"],
          properties: {
            hotelId: {
              type: Type.STRING,
              description: "The hotel ID matching the user query (must be one of: 'santorini-grand', 'kyoto-sanctuary', 'alpine-whisper', 'maldives-luminary', 'morocco-sandsara', 'newyork-vanderbilt')"
            },
            matchPercentage: {
              type: Type.INTEGER,
              description: "The percentage match for the traveler (e.g. 98)"
            },
            matchReasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three tailored premium justifications for why this property fits perfectly"
            },
            personalizedMessage: {
              type: Type.STRING,
              description: "A highly elegant, welcoming introduction by the concierge detailing the customized match"
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API");
    }

    const resultJson = JSON.parse(resultText);
    res.json(resultJson);
  } catch (error: any) {
    console.error("Gemini Recommend API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendation" });
  }
});

// Configure Vite or Serve SPA static files
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StayLux Full-Stack App running on port ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
