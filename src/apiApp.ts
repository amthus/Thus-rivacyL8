import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
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
        systemInstruction: "Tu es un expert juridique chevronné spécialisé dans l'audit approfondi de contrats et de documents professionnels. Ton rôle est d'analyser, déchiffrer et restituer proprement et en profondeur l'intégralité du contrat ou document fourni. Ne cache rien et ne te limite pas à un nombre restreint d'éléments : extrais tous les risques et points de vigilance identifiés (avec des niveaux d'évaluation précis : Élevé, Moyen, Faible), l'intégralité des obligations opérationnelles clés ou secondaires pour chaque partie impliquée (avec échéances), les mécanismes et pénalités de résiliation, ainsi que tous les points de conformité légale requis (notamment RGPD, droit applicable, limites de responsabilité). Rédige des explications claires, percutantes et juridiquement rigoureuses en français, formatées avec du Markdown simple. Pour les identifiants uniques (id), utilise des identifiants courts incrémentaux (ex: risk_1, risk_2, ob_1, ob_2, comp_1, comp_2). Garantis une sécurité d'analyse optimale en préservant le secret professionnel.",
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

app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, source, msgType, message, channel, countryCode, phoneNum, emailAddr } = req.body;

    if (!fullName || !message || !channel) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const whatsappPhone = process.env.CONTACT_WHATSAPP_PHONE || "22946879142";
    const contactEmail = process.env.CONTACT_EMAIL || "ametepemalthus16@gmail.com";

    let templateContent = "";
    let formattedMessage = "";

    if (channel === "whatsapp") {
      const templatePath = path.join(process.cwd(), "src/templates/whatsappTemplate.txt");
      templateContent = fs.readFileSync(templatePath, "utf8");
      
      formattedMessage = templateContent
        .replace("{fullName}", fullName || "")
        .replace("{source}", source || "Non specifie")
        .replace("{msgType}", msgType || "")
        .replace("{message}", message || "")
        .replace("{countryCode}", countryCode || "")
        .replace("{phoneNum}", phoneNum || "");

      console.log("-----------------------------------------");
      console.log(`[SECURE BACKGROUND DISPATCH] Sending WhatsApp Message to ${whatsappPhone}`);
      console.log(`Payload Body:\n${formattedMessage}`);
      console.log("-----------------------------------------");
      
    } else if (channel === "email") {
      const templatePath = path.join(process.cwd(), "src/templates/emailTemplate.txt");
      templateContent = fs.readFileSync(templatePath, "utf8");

      formattedMessage = templateContent
        .replace("{fullName}", fullName || "")
        .replace("{source}", source || "Non specifie")
        .replace("{msgType}", msgType || "")
        .replace("{message}", message || "")
        .replace("{emailAddr}", emailAddr || "");

      console.log("-----------------------------------------");
      console.log(`[SECURE BACKGROUND DISPATCH] Sending Email to ${contactEmail}`);
      console.log(`Payload Body:\n${formattedMessage}`);
      console.log("-----------------------------------------");
    } else {
      return res.status(400).json({ error: "Invalid channel" });
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error("Error in contact endpoint:", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de l'envoi." });
  }
});

export default app;
