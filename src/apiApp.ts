import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    parties: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    duration: { type: Type.STRING },
    summary: { type: Type.STRING },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          clause: { type: Type.STRING },
          level: { type: Type.STRING },
          description: { type: Type.STRING },
          recommendation: { type: Type.STRING },
        },
        required: ["id", "clause", "level", "description", "recommendation"],
      },
    },
    obligations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          party: { type: Type.STRING },
          description: { type: Type.STRING },
          deadline: { type: Type.STRING },
        },
        required: ["id", "party", "description", "deadline"],
      },
    },
    termination: {
      type: Type.OBJECT,
      properties: {
        mechanism: { type: Type.STRING },
        noticePeriod: { type: Type.STRING },
        penalties: { type: Type.STRING },
        details: { type: Type.STRING },
      },
      required: ["mechanism", "noticePeriod", "penalties", "details"],
    },
    compliance: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          subject: { type: Type.STRING },
          status: { type: Type.STRING },
          details: { type: Type.STRING },
          remedy: { type: Type.STRING },
        },
        required: ["id", "subject", "status", "details", "remedy"],
      },
    },
  },
  required: [
    "title",
    "parties",
    "duration",
    "summary",
    "risks",
    "obligations",
    "termination",
    "compliance",
  ],
};

app.post("/api/analyze-contract", async (req, res) => {
  try {
    let ai;
    try {
      ai = getAI();
    } catch (e: any) {
      return res.status(500).json({ 
        error: "La clé API GEMINI_API_KEY est manquante. Veuillez configurer la variable d'environnement GEMINI_API_KEY dans vos paramètres Vercel." 
      });
    }

    const { fileBase64, fileType, rawText } = req.body;

    let contents: any[] = [];

    if (fileBase64 && fileType) {
      contents.push({
        inlineData: {
          mimeType: fileType,
          data: fileBase64,
        },
      });
      contents.push({
        text: "Analyse ce contrat de manière exhaustive. Extrais les informations requises dans le schéma JSON de réponse en français.",
      });
    } else if (rawText) {
      contents.push({
        text: `Voici le texte du contrat à analyser : \n\n${rawText}\n\nAnalyse ce contrat de manière exhaustive. Extrais les informations requises dans le schéma JSON de réponse en français.`,
      });
    } else {
      return res.status(400).json({ error: "No content provided for analysis" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "Tu es un expert juridique spécialisé dans l'analyse de contrats. Ton rôle est d'analyser le contrat fourni de manière extrêmement rapide, synthétique et concise pour respecter les contraintes strictes de temps d'exécution de Vercel. Limite-toi à un maximum de 3 risques majeurs, 3 obligations clés et 3 points de conformité les plus importants. Rédige des explications courtes, percutantes et précises en français, formatées avec du Markdown simple (listes à puces, gras). Évite absolument les longs paragraphes d'introduction ou de conclusion pour maximiser la vitesse. Pour les identifiants uniques (id), utilise des identifiants courts comme risk_1, ob_1, comp_1.",
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Failed to generate analysis" });
    }

    const result = JSON.parse(text.trim());
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "An error occurred during analysis" });
  }
});

app.post("/api/translate", async (req, res) => {
  try {
    let ai;
    try {
      ai = getAI();
    } catch (e: any) {
      return res.status(500).json({ 
        error: "La clé API GEMINI_API_KEY est manquante. Veuillez configurer la variable d'environnement GEMINI_API_KEY dans vos paramètres Vercel." 
      });
    }

    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Traduis de manière rapide et directe le texte juridique suivant en ${targetLanguage}. Conserve la structure et le ton professionnel juridique. Rends uniquement la traduction brute, sans commentaires, explications ou fioritures : \n\n${text}`,
    });

    const translatedText = response.text;
    if (!translatedText) {
      return res.status(500).json({ error: "Failed to translate text" });
    }

    return res.json({ translatedText: translatedText.trim(), language: targetLanguage });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "An error occurred during translation" });
  }
});

export default app;
