import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// NOTE: In a production app, these calls should be proxied through a backend to protect the API KEY.
// The instructions specify using process.env.API_KEY directly for this prototype.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface PlaceResult {
  title: string;
  address?: string;
  uri?: string;
}

export const searchPlaces = async (query: string, userLocation?: { lat: number; lng: number }): Promise<PlaceResult[]> => {
  try {
    const modelId = "gemini-2.5-flash"; // Required for googleMaps tool
    
    const toolConfig = userLocation ? {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }
      }
    } : undefined;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Find places related to this query: "${query}". Return a list of places found with their names and addresses.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) return [];

    const groundingChunks = candidates[0].groundingMetadata?.groundingChunks;
    const places: PlaceResult[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => { // Type 'any' used here as specific grounding chunk types might vary
        if (chunk.web?.uri && chunk.web?.title) {
             places.push({
                title: chunk.web.title,
                uri: chunk.web.uri,
                address: "Web Result"
            });
        }
      });
    }

    // Since grounding chunks structure can be complex and sometimes the text response 
    // is better formatted by the model itself, we primarily rely on the tool output if available.
    // However, for this prototype, we'll also parse the text if no chunks are strictly formatted 
    // or just return a mock if the API key is missing/fails to ensure the UI works.

    if (places.length === 0) {
        // Fallback or additional parsing could go here. 
        // For the purpose of the prototype, if we get text back, we can try to display it,
        // but structured data is best.
    }

    return places;

  } catch (error) {
    console.error("Gemini Search Error:", error);
    // Return empty array to handle gracefully in UI
    return [];
  }
};