import { GoogleGenAI } from "@google/genai";

/**
 * Removes the NotebookLM watermark from the image using Gemini 3.
 * @param base64Image The source image in base64 format (data URL).
 * @returns The cleaned image in base64 format.
 */
export const removeWatermark = async (base64Image: string): Promise<string> => {
  // Initialize the client inside the function to ensure it uses the most recent API_KEY
  // from process.env after the user selects it via window.aistudio.openSelectKey()
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Extract the raw base64 string (remove data:image/jpeg;base64, prefix)
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));

  // Prompt engineering is key here.
  // We want to target the specific watermark.
  const prompt = "Remove the 'NotebookLM' text and logo watermark from the bottom right corner of this slide. Fill the area with the background color or pattern to make it look seamless. Do not alter any other text or graphics on the slide.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Using Gemini 3 Pro Image Preview for high quality editing
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    });

    // Parse response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct the returned image data URL
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};