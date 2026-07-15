import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

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
    if (!apiKey) {
      return res.status(500).json({ error: "API key is missing" });
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
        systemInstruction: "Tu es un expert juridique spécialisé dans l'analyse de contrats. Ton rôle est de disséquer le contrat fourni, d'extraire les éléments clés avec précision et rigueur, d'identifier tous les risques juridiques majeurs, de lister les obligations des parties, d'expliquer les conditions de résiliation et d'évaluer la conformité générale. Fournis toutes tes réponses en français technique, clair et précis. Formate abondamment tes réponses textuelles (synthèse, descriptions de risques, recommandations, remèdes de conformité) avec du Markdown riche : utilise des listes à puces, des paragraphes bien espacés, des termes en gras pour souligner les concepts clés, et des avertissements clairs pour attirer l'attention sur les points cruciaux. Pour les identifiants uniques (id) génère des identifiants courts uniques comme risk_1, risk_2, ob_1, ob_2, comp_1, comp_2.",
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
    if (!apiKey) {
      return res.status(500).json({ error: "API key is missing" });
    }

    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Traduis le texte juridique suivant en ${targetLanguage}. Conserve la structure et le ton professionnel juridique. Rends uniquement le texte traduit sans explications ni fioritures : \n\n${text}`,
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

async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  main().catch((err) => {
    console.error(err);
  });
}

export default app;
