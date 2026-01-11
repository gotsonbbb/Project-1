
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingPlan } from './types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractJSON = (text: string): any => {
  try {
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    const firstOpen = text.indexOf('{');
    const lastClose = text.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      try {
        return JSON.parse(text.substring(firstOpen, lastClose + 1));
      } catch (e2) {
        throw new Error("AI data format error.");
      }
    }
    throw new Error("Failed to parse AI response.");
  }
};

export const generateMarketingContent = async (input: { 
  link?: string; 
  image?: { data: string; mimeType: string };
  price?: string;
  phone?: string;
}): Promise<MarketingPlan & { sources?: string[] }> => {
  const ai = getAI();
  const prompt = `
    TASK: Acts as a world-class Myanmar Marketing Guru for an Amazon Affiliate Business. 
    Analyze ${input.link ? `this product: ${input.link}` : 'this product image'}.
    User Info: Price(${input.price || 'Not Set'}), Phone(${input.phone || 'Not Set'}).

    REQUIREMENTS for 'postCaption':
    1. Hook: Emotional or Curiosity-based opening in Myanmar (Burmese).
    2. Body: Explain benefits using "Problem-Solution" framework.
    3. Language: Use natural, persuasive, and trending Myanmar online shopping slangs.
    4. Call to Action: Urgency-driven with the provided phone/link.
    5. Affiliate Disclosure: Mention clearly that this is an affiliate link in the text.

    REQUIREMENTS for 'strategyAdvice':
    Provide 3 professional tips on how to boost sales for this specific item on Facebook.

    REQUIREMENTS for 'videoScript':
    Create a 15-second TikTok/Reels script that focuses on a "Life-Changing" or "Aesthetic" aspect.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { 
      parts: [
        { text: prompt },
        ...(input.image ? [{ inlineData: { data: input.image.data, mimeType: input.image.mimeType } }] : [])
      ] 
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          postCaption: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          postingTimeSuggestion: { type: Type.STRING },
          strategyAdvice: { type: Type.STRING },
          videoScript: { type: Type.STRING }
        },
        required: ["productName", "postCaption", "hashtags", "postingTimeSuggestion", "strategyAdvice", "videoScript"]
      },
      tools: input.link ? [{ googleSearch: {} }] : []
    }
  });

  const plan = extractJSON(response.text || '');
  
  const sources: string[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) sources.push(chunk.web.uri);
    });
  }

  return { ...plan, sources };
};

export const generateProductVisual = async (productName: string, sourceImage?: { data: string, mimeType: string }): Promise<string> => {
  const ai = getAI();
  
  const studioPrompt = sourceImage 
    ? `TASK: Refine this product image. 
       Keep the central product EXACTLY as it is, but replace the background with a premium professional photography studio. 
       Environment: Soft-grey minimalist studio with professional 3-point lighting.
       Colors: Cinematic, high-contrast, commercial color grading.
       Quality: 8k resolution, ultra-detailed, professional advertisement style.`
    : `TASK: Generate a high-end product advertisement photo for "${productName}". 
       Environment: Professional studio setting, soft-box lighting, cinematic shadows. 
       Style: Premium, minimalist, 8k resolution, commercial advertising photography.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { 
      parts: [
        ...(sourceImage ? [{ inlineData: { data: sourceImage.data, mimeType: sourceImage.mimeType } }] : []),
        { text: studioPrompt }
      ] 
    }
  });
  
  const imgPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (imgPart?.inlineData) return `data:image/png;base64,${imgPart.inlineData.data}`;
  throw new Error("Visual generation failed.");
};

export const generateLogo = async (brandName: string, style: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { 
      parts: [{ 
        text: `Premium brand logo for '${brandName}'. Style: ${style}. 
        Minimalist, vector style, white background, high-end corporate branding, professional typography.` 
      }] 
    }
  });
  const imgPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (imgPart?.inlineData) return `data:image/png;base64,${imgPart.inlineData.data}`;
  throw new Error("Logo generation failed.");
};
