
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

export const getStyleRecommendation = async (userPrompt: string, products: Product[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const productContext = products.map(p => `ID: ${p.id} | ${p.name} (${p.category}, ${p.style})`).join('\n');

  const prompt = `You are a fashion expert at "Goyal Cloth Store". 
  User wants advice: "${userPrompt}"
  Available Catalog:
  ${productContext}
  
  Provide your recommendation in a valid JSON format with:
  1. "advice": A friendly 2-3 sentence explanation.
  2. "recommendedIds": An array of product IDs from the catalog that best match.
  
  Only return the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { advice: "I'm having trouble connecting to my database. Please browse our collections!", recommendedIds: [] };
  }
};

export const generateProductDescription = async (productName: string, category: string, style: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `Write a compelling 2-sentence marketing description for a new item at Goyal Cloth Store:
  Product: ${productName}
  Category: ${category}
  Style: ${style}
  Focus on quality, elegance, and the blend of modern/traditional values.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    return "No description available.";
  }
};
