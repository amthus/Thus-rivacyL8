import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import fs from "fs";
import path from "path";

const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères." }),
  source: z
    .string()
    .max(100, { message: "La source ne peut pas dépasser 100 caractères." })
    .optional()
    .default("Non spécifié"),
  msgType: z
    .string()
    .max(50, { message: "Le type de message est trop long." }),
  message: z
    .string()
    .min(10, { message: "Le message doit contenir au moins 10 caractères." })
    .max(5000, { message: "Le message ne peut pas dépasser 5000 caractères." }),
  channel: z.enum(["whatsapp", "email"]),
  countryCode: z
    .string()
    .max(10, { message: "Le code pays est trop long." })
    .optional(),
  phoneNum: z
    .string()
    .max(20, { message: "Le numéro de téléphone est trop long." })
    .optional(),
  emailAddr: z
    .string()
    .max(100, { message: "L'adresse e-mail est trop longue." })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return z.string().email().safeParse(val).success;
      },
      { message: "Adresse e-mail invalide." }
    ),
});

function sanitize(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[&<>"']/g, (match) => {
      const escapeMap: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
      };
      return escapeMap[match] || match;
    })
    .trim();
}

export async function contactHandler(req: Request, res: Response) {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return res.status(400).json({ error: firstError });
    }

    const data = parseResult.data;
    const fullName = sanitize(data.fullName);
    const source = sanitize(data.source);
    const msgType = sanitize(data.msgType);
    const message = sanitize(data.message);
    const channel = data.channel;
    const countryCode = data.countryCode ? sanitize(data.countryCode).replace(/[^\d+]/g, "") : "";
    const phoneNum = data.phoneNum ? sanitize(data.phoneNum).replace(/[^\d]/g, "") : "";
    const emailAddr = data.emailAddr ? sanitize(data.emailAddr) : "";

    const contactEmail = process.env.CONTACT_EMAIL || "ametepemalthus16@gmail.com";
    const smtpHost = process.env.SMTP_HOST || "";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    const smtpFromName = process.env.SMTP_FROM_NAME || "Thus L8 Analyzer";

    let templateContent = "";
    let formattedMessage = "";

    try {
      if (channel === "whatsapp") {
        const templatePath = path.join(process.cwd(), "src/templates/whatsappTemplate.txt");
        templateContent = fs.readFileSync(templatePath, "utf8");
        formattedMessage = templateContent
          .replace("{fullName}", fullName)
          .replace("{source}", source)
          .replace("{msgType}", msgType)
          .replace("{message}", message)
          .replace("{countryCode}", countryCode)
          .replace("{phoneNum}", phoneNum);
      } else {
        const templatePath = path.join(process.cwd(), "src/templates/emailTemplate.txt");
        templateContent = fs.readFileSync(templatePath, "utf8");
        formattedMessage = templateContent
          .replace("{fullName}", fullName)
          .replace("{source}", source)
          .replace("{msgType}", msgType)
          .replace("{message}", message)
          .replace("{emailAddr}", emailAddr);
      }
    } catch (fsErr) {
      console.error("[SMTP ERROR] Template file reading failed:", fsErr);
      return res.status(500).json({
        error: "Erreur serveur : Impossible de charger les modèles de message.",
      });
    }

    const isSmtpConfigured =
      smtpHost &&
      smtpUser &&
      smtpPass &&
      smtpUser !== "your-email@gmail.com" &&
      smtpPass !== "your-app-password";

    if (!isSmtpConfigured) {
      console.warn("------------------------------------------------------------------");
      console.warn("[WARNING] SMTP Server is NOT configured yet. Logging the message:");
      console.warn(`Channel: ${channel.toUpperCase()}`);
      console.warn(`To Admin: ${contactEmail}`);
      console.warn(`Body:\n${formattedMessage}`);
      console.warn("------------------------------------------------------------------");

      return res.status(400).json({
        error: "Le serveur SMTP de messagerie n'est pas encore configuré. Veuillez configurer les variables SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) dans vos paramètres pour recevoir les e-mails.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    try {
      const info = await transporter.sendMail({
        from: `"${smtpFromName}" <${smtpUser}>`,
        to: contactEmail,
        replyTo: channel === "email" && emailAddr ? emailAddr : undefined,
        subject: `[Thus L8] Nouveau message - ${fullName} (${msgType})`,
        text: formattedMessage,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
              Nouveau message depuis Thus L8
            </h2>
            <p style="margin: 15px 0;"><strong>Nom complet :</strong> ${fullName}</p>
            <p style="margin: 15px 0;"><strong>Comment l'utilisateur a connu l'app :</strong> ${source}</p>
            <p style="margin: 15px 0;"><strong>Nature du message :</strong> <span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${msgType}</span></p>
            <p style="margin: 15px 0;"><strong>Message :</strong></p>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #4f46e5; font-style: italic; white-space: pre-wrap; margin: 15px 0; border-radius: 4px; color: #334155;">${message}</div>
            
            ${
              channel === "whatsapp"
                ? `<p style="margin: 15px 0;"><strong>Contact WhatsApp :</strong> <a href="https://wa.me/${(countryCode + phoneNum).replace(/\+/g, "")}" style="color: #10b981; font-weight: bold; text-decoration: none;">${countryCode} ${phoneNum}</a></p>`
                : `<p style="margin: 15px 0;"><strong>Adresse e-mail :</strong> <a href="mailto:${emailAddr}" style="color: #4f46e5; font-weight: bold; text-decoration: none;">${emailAddr}</a></p>`
            }
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #64748b; text-align: center;">Ce message a été généré et sécurisé par Thus L8 Backend.</p>
          </div>
        `,
      });

      console.log(`[SMTP SUCCESS] Message sent successfully. MessageId: ${info.messageId}`);
      return res.json({ success: true });
    } catch (smtpErr: any) {
      console.error("[SMTP ERROR] Failed to send email via SMTP:", smtpErr);

      let clientError = "Une erreur SMTP est survenue lors de l'envoi de l'e-mail.";

      if (smtpErr.code === "EAUTH" || smtpErr.message?.includes("auth") || smtpErr.message?.includes("Authentication")) {
        clientError = "Échec d'authentification SMTP : L'adresse e-mail ou le mot de passe d'application est incorrect.";
      } else if (smtpErr.code === "ETIMEOUT" || smtpErr.message?.includes("timeout")) {
        clientError = "Le serveur SMTP a mis trop de temps à répondre. Veuillez vérifier la connexion ou le port d'envoi.";
      } else if (smtpErr.code === "ECONNREFUSED" || smtpErr.message?.includes("connect")) {
        clientError = "Connexion refusée par le serveur SMTP. Veuillez vérifier l'hôte (SMTP_HOST) et le port (SMTP_PORT).";
      }

      return res.status(500).json({ error: clientError });
    }
  } catch (err: any) {
    console.error("[CONTACT HANDLER ERROR] Unhandled exception:", err);
    return res.status(500).json({
      error: "Une erreur interne est survenue lors du traitement de votre demande.",
    });
  }
}
