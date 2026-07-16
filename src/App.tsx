import React, { useState, useRef } from "react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Globe,
  Download,
  ArrowRight,
  Check,
  Clock,
  Users,
  ShieldAlert,
  AlertCircle,
  FileUp,
  X,
  FileSpreadsheet,
  ChevronDown
} from "lucide-react";
import { ContractAnalysis } from "./types";
import Header from "./components/Header";
import AboutView from "./components/AboutView";
import ContactView from "./components/ContactView";
import ShareModal from "./components/ShareModal";
import SecurityCertificates from "./components/SecurityCertificates";
import { DEMO_CONTRACTS } from "./data/demoContracts";
import { generatePDF } from "./utils/pdfGenerator";
import { LEGAL_TERMS } from "./data/legalTerms";
import { TRANSLATIONS } from "./lang/translations";

function sanitizeText(str: string | undefined | null): string {
  if (!str) return "";
  return str.replace(/\*\*/g, "").replace(/\*/g, "").trim();
}

function formatUserFriendlyError(rawError: any, lang: "fr" | "en"): string {
  if (!rawError) {
    return lang === "fr" ? "Une erreur inconnue est survenue." : "An unknown error has occurred.";
  }

  let errorText = "";
  if (typeof rawError === "object") {
    if (rawError.message) {
      errorText = rawError.message;
    } else {
      try {
        errorText = JSON.stringify(rawError);
      } catch {
        errorText = String(rawError);
      }
    }
  } else {
    errorText = String(rawError);
  }

  // Attempt to find and extract JSON block
  let jsonExtracted: any = null;
  const jsonMatch = errorText.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    try {
      jsonExtracted = JSON.parse(jsonMatch[1]);
    } catch {
      // Ignored
    }
  }

  if (!jsonExtracted) {
    try {
      jsonExtracted = JSON.parse(errorText);
    } catch {
      // Ignored
    }
  }

  let code: any = null;
  let message: string = "";
  let status: string = "";

  if (jsonExtracted) {
    const errObj = jsonExtracted.error || jsonExtracted;
    if (typeof errObj === "object" && errObj !== null) {
      code = errObj.code || jsonExtracted.code;
      message = errObj.message || jsonExtracted.message || "";
      status = errObj.status || jsonExtracted.status || "";
    } else if (typeof errObj === "string") {
      message = errObj;
    }
  }

  const finalMessage = message || errorText;
  const lowerMsg = finalMessage.toLowerCase();
  const lowerStatus = status ? status.toLowerCase() : "";

  // 1. High demand / Service unavailable (503)
  if (
    code === 503 || 
    lowerStatus.includes("unavailable") || 
    lowerMsg.includes("high demand") || 
    lowerMsg.includes("temporarily overloaded") ||
    lowerMsg.includes("unavailable") ||
    lowerMsg.includes("service_unavailable") ||
    lowerMsg.includes("experiencing high demand")
  ) {
    return lang === "fr"
      ? "Le service d'analyse par IA est actuellement très sollicité en raison d'une forte affluence. Ces pics de demande sont généralement temporaires. Veuillez patienter quelques instants puis réessayer."
      : "The AI analysis service is currently experiencing high demand. These temporary spikes usually resolve quickly. Please wait a moment and try again.";
  }

  // 2. Rate limit / Too many requests (429)
  if (
    code === 429 || 
    lowerStatus.includes("resource_exhausted") || 
    lowerMsg.includes("quota") || 
    lowerMsg.includes("rate limit") || 
    lowerMsg.includes("too many requests") ||
    lowerMsg.includes("exhausted")
  ) {
    return lang === "fr"
      ? "Limite d'utilisation de l'IA atteinte ou quota dépassé. Veuillez patienter une minute avant de soumettre une nouvelle analyse."
      : "AI usage limit reached or quota exceeded. Please wait a minute before submitting another analysis.";
  }

  // 3. Size / Payload too large / Vercel body limits (413)
  if (
    code === 413 || 
    lowerMsg.includes("payload too large") || 
    lowerMsg.includes("request entity too large") || 
    lowerMsg.includes("too large") || 
    lowerMsg.includes("body size limit") ||
    lowerMsg.includes("maximum size")
  ) {
    return lang === "fr"
      ? "Le document transmis est trop volumineux. Pour garantir une analyse optimale, veuillez utiliser un document de moins de 3 Mo."
      : "The document you uploaded is too large. To ensure an optimal analysis, please use a file smaller than 3 MB.";
  }

  // 4. Timeout (504)
  if (
    code === 504 || 
    lowerMsg.includes("timeout") || 
    lowerMsg.includes("deadline exceeded") || 
    lowerMsg.includes("timed out")
  ) {
    return lang === "fr"
      ? "L'analyse a pris plus de temps que prévu en raison de la complexité du document. Veuillez réessayer avec un texte légèrement plus court ou un document textuel direct."
      : "The analysis took longer than expected due to the complexity of the document. Please try again with a slightly shorter text or direct text-based document.";
  }

  // 5. Connection error / API key issues / Invalid argument (400 / 500 etc)
  if (lowerMsg.includes("api key") || lowerMsg.includes("apikey")) {
    return lang === "fr"
      ? "Configuration serveur incorrecte (clé API manquante ou invalide). Veuillez contacter l'administrateur."
      : "Server configuration issue (missing or invalid API key). Please contact the administrator.";
  }

  if (lowerMsg.includes("invalid argument") || lowerMsg.includes("bad request") || code === 400) {
    return lang === "fr"
      ? "Le contenu transmis ou le format du fichier n'est pas pris en charge ou est corrompu."
      : "The submitted content or file format is unsupported or corrupted.";
  }

  // Fallback cleanup of HTML
  let cleaned = errorText;
  if (errorText.toLowerCase().includes("<html") || errorText.toLowerCase().includes("<body")) {
    const bodyMatch = errorText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const contentToClean = bodyMatch && bodyMatch[1] ? bodyMatch[1] : errorText;
    cleaned = contentToClean
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .trim();
  }

  // Strips technical prefixes and handles JSON leakage
  cleaned = cleaned.replace(/erreur\s*d'analyse\s*/gi, "");
  cleaned = cleaned.replace(/^[^{\n]*(\{[\s\S]*\})[^\n]*$/gi, "$1");

  if (cleaned.trim().startsWith("{") && cleaned.trim().endsWith("}")) {
    return lang === "fr"
      ? "Une erreur technique s'est produite lors de l'appel au moteur d'IA. Veuillez réessayer dans quelques instants."
      : "A technical error occurred while calling the AI engine. Please try again in a few moments.";
  }

  if (cleaned.length > 150 && !cleaned.includes(" ")) {
    return lang === "fr"
      ? "Une erreur technique inattendue est survenue lors du traitement."
      : "An unexpected technical error occurred during processing.";
  }

  if (cleaned.toLowerCase() === "failed to fetch") {
    return lang === "fr"
      ? "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet."
      : "Failed to connect to the server. Please check your internet connection.";
  }

  return cleaned;
}

function translateVercelError(rawText: string, lang: "fr" | "en"): string {
  return formatUserFriendlyError(rawText, lang);
}

interface TooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

function Tooltip({ term, definition, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-block whitespace-nowrap"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="underline decoration-dotted decoration-slate-400 hover:decoration-solid cursor-help text-slate-800 hover:text-slate-950 font-bold transition-all bg-slate-100/80 hover:bg-slate-200 px-1.5 py-0.5 rounded-md">
        {children}
      </span>
      <AnimatePresence>
        {isVisible && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-[11px] rounded-lg p-3 shadow-xl z-50 pointer-events-none text-left font-sans whitespace-normal"
          >
            <span className="font-bold block border-b border-slate-700 pb-1 mb-1 text-slate-200">
              {term}
            </span>
            <span className="block leading-relaxed text-slate-200 font-medium">
              {definition}
            </span>
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

interface LegalTermHighlighterProps {
  text: string;
  lang: "fr" | "en";
}

function LegalTermHighlighter({ text, lang }: LegalTermHighlighterProps) {
  if (!text) return null;

  const termsMap = LEGAL_TERMS[lang] || LEGAL_TERMS["fr"];
  const sortedTerms = Object.keys(termsMap).sort((a, b) => b.length - a.length);

  if (sortedTerms.length === 0) return <>{text}</>;

  const escapedTerms = sortedTerms.map(term =>
    term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  );

  const regexStr = `(?<=[\\s,.;:!?\\"'()\\-\\[\\]]|^)(${escapedTerms.join("|")})(?=[\\s,.;:!?\\"'()\\-\\[\\]]|$)`;
  const regex = new RegExp(regexStr, "gi");

  const parts = text.split(regex);
  if (parts.length <= 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        const definition = termsMap[lowerPart];
        if (definition) {
          return (
            <Tooltip key={index} term={part} definition={definition}>
              {part}
            </Tooltip>
          );
        }
        return part;
      })}
    </>
  );
}

function highlightLegalTermsInNode(node: React.ReactNode, lang: "fr" | "en"): React.ReactNode {
  if (typeof node === "string") {
    return <LegalTermHighlighter text={node} lang={lang} />;
  }
  if (Array.isArray(node)) {
    return node.map((child, idx) => (
      <React.Fragment key={idx}>
        {highlightLegalTermsInNode(child, lang)}
      </React.Fragment>
    ));
  }
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<any>;
    const children = element.props?.children;
    if (children) {
      return React.cloneElement(element, {
        children: highlightLegalTermsInNode(children, lang)
      });
    }
  }
  return node;
}

export default function App() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = TRANSLATIONS[lang];

  React.useEffect(() => {
    // Ensure dark mode class is stripped from document root if it was set
    document.documentElement.classList.remove("dark");
  }, []);

  const [activeTab, setActiveTab] = useState<"summary" | "risks" | "obligations" | "termination" | "compliance">("summary");
  const [rawTextInput, setRawTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const [translationLang, setTranslationLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translationSource, setTranslationSource] = useState<string>("");

  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [checkedObligations, setCheckedObligations] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.type === "text/plain") {
        setSelectedFile(file);
        setRawTextInput("");
      } else {
        setErrorMsg("Seuls les fichiers PDF et texte brut (.txt) sont acceptés.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.type === "text/plain") {
        setSelectedFile(file);
        setRawTextInput("");
      } else {
        setErrorMsg("Seuls les fichiers PDF et texte brut (.txt) sont acceptés.");
      }
    }
  };

  const loadSampleContract = (text: string) => {
    setSelectedFile(null);
    setRawTextInput(text);
    setErrorMsg(null);
  };

  const clearInputs = () => {
    setSelectedFile(null);
    setRawTextInput("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjs = (window as any).pdfjsLib;
    if (!pdfjs) {
      throw new Error("PDF_JS_NOT_LOADED");
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str || "");
      text += strings.join(" ") + "\n";
    }
    return text;
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisResult(null);
    setTranslatedContent(null);
    setShowAbout(false);
    setShowContact(false);

    try {
      let payload: any = {};

      if (selectedFile) {
        if (selectedFile.type === "application/pdf") {
          let extractedText = "";
          try {
            extractedText = await extractTextFromPdf(selectedFile);
          } catch (e) {
            console.warn("Client-side PDF text extraction failed or not available:", e);
          }

          if (extractedText && extractedText.trim().length > 30) {
            payload = {
              rawText: extractedText,
              fileName: selectedFile.name,
            };
          } else {
            // PDF is empty / scanned. Check file size.
            if (selectedFile.size > 3.2 * 1024 * 1024) {
              throw new Error(
                lang === "fr"
                  ? `Ce fichier PDF fait ${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo et ne contient pas de texte sélectionnable (il s'agit probablement d'un document scanné ou d'images). Pour respecter les limites de taille de Vercel, veuillez utiliser un document PDF textuel de moins de 3 Mo.`
                  : `This PDF file is ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB and does not contain selectable text (it seems to be scanned or image-based). To comply with Vercel body size limits, please use a text-based PDF file or a file smaller than 3 MB.`
              );
            }
            const base64Data = await convertToBase64(selectedFile);
            payload = {
              fileBase64: base64Data,
              fileType: selectedFile.type,
              fileName: selectedFile.name,
            };
          }
        } else if (selectedFile.type === "text/plain") {
          const text = await selectedFile.text();
          payload = {
            rawText: text,
            fileName: selectedFile.name,
          };
        } else {
          if (selectedFile.size > 3.2 * 1024 * 1024) {
            throw new Error(
              lang === "fr"
                ? `Ce fichier fait ${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo, ce qui dépasse la limite maximale autorisée sur Vercel (3 Mo).`
                : `This file is ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB, which exceeds the maximum size allowed on Vercel (3 MB).`
            );
          }
          const base64Data = await convertToBase64(selectedFile);
          payload = {
            fileBase64: base64Data,
            fileType: selectedFile.type,
            fileName: selectedFile.name,
          };
        }
      } else if (rawTextInput.trim()) {
        payload = {
          rawText: rawTextInput,
        };
      } else {
        setIsAnalyzing(false);
        setErrorMsg(
          lang === "fr"
            ? "Veuillez téléverser un fichier ou saisir le texte d'un contrat."
            : "Please upload a file or paste a contract text."
        );
        return;
      }

      const response = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        const translatedErr = translateVercelError(responseText, lang);
        console.error("Non-JSON Server Error:", responseText);
        throw new Error(translatedErr);
      }

      if (!response.ok) {
        const errorContent = data?.error ? (typeof data.error === "object" ? JSON.stringify(data.error) : data.error) : null;
        throw new Error(errorContent || (lang === "fr" ? "Erreur de communication avec le serveur." : "Server communication error."));
      }

      const finalResult: ContractAnalysis = {
        ...data,
        fileName: selectedFile ? selectedFile.name : "Texte Saisi",
        fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "N/A",
        fileType: selectedFile ? selectedFile.type : "text/plain",
      };

      setAnalysisResult(finalResult);
      setCheckedObligations({});
      setActiveTab("summary");
    } catch (err: any) {
      setErrorMsg(formatUserFriendlyError(err.message || err, lang));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerTranslation = async (textToTranslate: string) => {
    setIsTranslating(true);
    setTranslatedContent(null);
    setTranslationSource(textToTranslate);

    const langNames: Record<string, string> = {
      en: "Anglais (English)",
      ar: "Arabe (Arabic)",
      pt: "Portugais (Portuguese)",
      es: "Espagnol (Spanish)",
      de: "Allemand (German)",
      it: "Italien (Italian)",
      zh: "Chinois (Chinese)",
      ja: "Japonais (Japanese)",
      ru: "Russe (Russian)",
      fr: "Français (French)"
    };
    const targetLangFull = langNames[translationLang] || translationLang;

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage: targetLangFull,
        }),
      });

      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        const translatedErr = translateVercelError(responseText, lang);
        console.error("Non-JSON Translation Error:", responseText);
        throw new Error(translatedErr);
      }

      if (!response.ok) {
        const errorContent = data?.error ? (typeof data.error === "object" ? JSON.stringify(data.error) : data.error) : null;
        throw new Error(errorContent || (lang === "fr" ? "Erreur lors de la traduction." : "Translation error."));
      }

      setTranslatedContent(data.translatedText);
    } catch (err: any) {
      setTranslatedContent(`${lang === "fr" ? "Erreur" : "Error"} : ${formatUserFriendlyError(err.message || err, lang)}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const exportAnalysis = (format: "md" | "txt" | "pdf") => {
    if (!analysisResult) return;

    if (format === "pdf") {
      generatePDF(analysisResult, lang);
      return;
    }

    let content = "";
    if (format === "md") {
      content = `# Analyse du Document / Contrat : ${analysisResult.title}

## Informations de Synthèse
- **Parties contractantes :** ${analysisResult.parties.join(", ")}
- **Durée / Validité :** ${analysisResult.duration}
- **Fichier Source :** ${analysisResult.fileName} (${analysisResult.fileSize})

## Résumé Général
${analysisResult.summary}

## Clauses Risquées et Points de Vigilance
${analysisResult.risks
  .map(
    (r) => `### Risk [${r.level.toUpperCase()}] : ${r.clause}
- **Description :** ${r.description}
- **Recommandation :** ${r.recommendation}`
  )
  .join("\n\n")}

## Obligations Contractuelles Identifiées
${analysisResult.obligations
  .map((o) => `- **[${o.party}]** ${o.description} (Échéance : ${o.deadline})`)
  .join("\n")}

## Conditions de Résiliation et Rupture
- **Mécanismes :** ${analysisResult.termination.mechanism}
- **Délai de préavis :** ${analysisResult.termination.noticePeriod}
- **Pénalités de rupture :** ${analysisResult.termination.penalties}
- **Informations complémentaires :** ${analysisResult.termination.details}

## Analyse de Conformité Légale
${analysisResult.compliance
  .map(
    (c) => `### Sujet : ${c.subject} [Conformité : ${c.status.toUpperCase()}]
- **Détails :** ${c.details}
- **Mesure Corrective :** ${c.remedy}`
  )
  .join("\n\n")}
`;
    } else {
      content = `ANALYSE DU DOCUMENT / CONTRAT : ${analysisResult.title}
============================================================

INFORMATIONS DE SYNTHÈSE
------------------------
- Parties : ${analysisResult.parties.join(", ")}
- Durée / Validité : ${analysisResult.duration}
- Fichier source : ${analysisResult.fileName}

RÉSUMÉ GÉNÉRAL
--------------
${analysisResult.summary}

CLAUSES RISQUÉES IDENTIFIÉES
----------------------------
${analysisResult.risks
  .map(
    (r) => `* [Risque ${r.level.toUpperCase()}] : ${r.clause}
  Explication : ${r.description}
  Recommandation : ${r.recommendation}`
  )
  .join("\n\n")}

OBLIGATIONS CONTRACTUELLES
--------------------------
${analysisResult.obligations
  .map((o) => `* [${o.party}] ${o.description} (Échéance : ${o.deadline})`)
  .join("\n")}

CONDITIONS DE RÉSILIATION
-------------------------
- Mécanismes : ${analysisResult.termination.mechanism}
- Préavis : ${analysisResult.termination.noticePeriod}
- Pénalités : ${analysisResult.termination.penalties}
- Détails : ${analysisResult.termination.details}

CONFORMITÉ LÉGALE ET CONSEILS
------------------------------
${analysisResult.compliance
  .map(
    (c) => `* [${c.status.toUpperCase()}] ${c.subject}
  Détails : ${c.details}
  Action corrective : ${c.remedy}`
  )
  .join("\n\n")}
`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `analyse_${analysisResult.title.replace(/\s+/g, "_")}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleObligation = (id: string) => {
    setCheckedObligations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredRisks = analysisResult
    ? analysisResult.risks.filter((r) => riskFilter === "all" || r.level === riskFilter)
    : [];

  const completedObligationsCount = analysisResult
    ? analysisResult.obligations.filter((o) => checkedObligations[o.id]).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      <Header 
        lang={lang} 
        setLang={setLang} 
        showAbout={showAbout} 
        setShowAbout={setShowAbout} 
        showContact={showContact}
        setShowContact={setShowContact}
        onShare={handleShare} 
      />

      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold font-mono tracking-tight flex items-center gap-2 border border-slate-850"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{shareFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          key={showAbout ? "about" : showContact ? "contact" : lang}
          initial={{ opacity: 0.35, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
        >
          {showAbout ? (
            <AboutView lang={lang} onClose={() => setShowAbout(false)} />
          ) : showContact ? (
            <ContactView lang={lang} onClose={() => setShowContact(false)} />
          ) : !analysisResult ? (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {t.title}
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                {t.desc}
              </p>
            </div>

            {/* Grille de sélection des modèles de contrats premium */}
            <div className="space-y-4 bg-slate-100/50 rounded-2xl p-6 border border-slate-200/80">
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-yellow-200 text-yellow-950 px-2 py-1 rounded-md shadow-xs whitespace-normal break-words">
                    {t.demoTitle}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  {t.demoDesc}
                </p>
              </div>

              {/* Grille de sélection visible sur tablette & ordinateur */}
              <div className="hidden md:grid gap-6 md:grid-cols-3">
                {DEMO_CONTRACTS.map((demo) => {
                  const demoTypeTranslated =
                    demo.type === "Licence SaaS & Maintenance"
                      ? (lang === "fr" ? "Licence SaaS & Maintenance" : "SaaS License & Maintenance")
                      : demo.type === "Partenariat de Recherche"
                      ? (lang === "fr" ? "Partenariat de Recherche" : "Research Partnership")
                      : demo.type === "Accord de Services d'IA"
                      ? (lang === "fr" ? "Accord de Services d'IA" : "AI Services Agreement")
                      : demo.type;

                  const demoTitleTranslated =
                    demo.id === "saas_enterprise"
                      ? (lang === "fr" ? "Contrat de Licence SaaS Entreprise" : "Enterprise SaaS License Agreement")
                      : demo.id === "partenariat_technologique"
                      ? (lang === "fr" ? "Partenariat et Co-développement" : "Partnership & Co-development")
                      : demo.id === "accord_cadre_ia"
                      ? (lang === "fr" ? "Accord-Cadre Intégration IA" : "AI Integration Framework Agreement")
                      : demo.title;

                  const demoPartiesTranslated =
                    demo.id === "saas_enterprise"
                      ? (lang === "fr" ? "CloudMax Systems & RetailCorp Europe" : "CloudMax Systems & RetailCorp Europe")
                      : demo.id === "partenariat_technologique"
                      ? (lang === "fr" ? "MegaTech Labs & Robotix Solutions" : "MegaTech Labs & Robotix Solutions")
                      : demo.id === "accord_cadre_ia"
                      ? (lang === "fr" ? "Neural Consulting & Banking Global Services" : "Neural Consulting & Banking Global Services")
                      : demo.parties;

                  return (
                    <div
                      key={demo.id}
                      className={`flex flex-col justify-between rounded-xl border p-4.5 transition-all bg-gradient-to-b from-white to-slate-50/25 hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer ${
                        rawTextInput === demo.text
                          ? "border-slate-900 ring-2 ring-slate-900/10 shadow-xs"
                          : "border-slate-200/80 hover:border-slate-400"
                      }`}
                      onClick={() => loadSampleContract(demo.text)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200/60 px-2 py-0.5 text-[9px] font-bold text-slate-600 uppercase tracking-wider leading-none">
                            {demoTypeTranslated}
                          </span>
                          <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[9px] font-bold text-emerald-800 leading-none shrink-0">
                            30 {lang === "fr" ? "Articles" : "Articles"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug tracking-tight">
                            {demoTitleTranslated}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              {t.partiesConcerned}
                            </p>
                            <p className="text-xs text-slate-700 font-bold leading-relaxed">
                              {demoPartiesTranslated}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          {t.docReady}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadSampleContract(demo.text);
                          }}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer active:scale-[0.98] ${
                            rawTextInput === demo.text
                              ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                              : "bg-slate-950 text-white shadow-xs hover:bg-slate-800 border border-slate-900"
                          }`}
                        >
                          {rawTextInput === demo.text ? t.selected : t.loadModel}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sélecteur mobile élégant */}
              <div className="block md:hidden">
                <div className="relative">
                  <select
                    id="mobile-contract-select"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none pr-10 cursor-pointer"
                    value={DEMO_CONTRACTS.find(d => d.text === rawTextInput)?.id || ""}
                    onChange={(e) => {
                      const selectedDemo = DEMO_CONTRACTS.find(d => d.id === e.target.value);
                      if (selectedDemo) {
                        loadSampleContract(selectedDemo.text);
                      }
                    }}
                  >
                    <option value="" disabled className="text-slate-400">
                      {lang === "fr" ? "Sélectionner un modèle de contrat..." : "Select a contract template..."}
                    </option>
                    {DEMO_CONTRACTS.map((demo) => {
                      const demoTitleTranslated =
                        demo.id === "saas_enterprise"
                          ? (lang === "fr" ? "Contrat de Licence SaaS Entreprise" : "Enterprise SaaS License Agreement")
                          : demo.id === "partenariat_technologique"
                          ? (lang === "fr" ? "Partenariat et Co-développement" : "Partnership & Co-development")
                          : demo.id === "accord_cadre_ia"
                          ? (lang === "fr" ? "Accord-Cadre Intégration IA" : "AI Integration Framework Agreement")
                          : demo.title;

                      return (
                        <option key={demo.id} value={demo.id} className="text-slate-900">
                          {demoTitleTranslated}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                      {t.uploadTitle}
                    </h3>
                    {(selectedFile || rawTextInput) && (
                      <button
                        onClick={clearInputs}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        {t.reset}
                      </button>
                    )}
                  </div>

                  {!selectedFile && !rawTextInput && (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-12 text-center transition-all hover:border-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <FileUp className="h-6 w-6 text-slate-600" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-900">
                        {t.dragDrop}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {t.pdfTxtOnly}
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf,text/plain"
                        className="hidden"
                      />
                    </div>
                  )}

                  {(selectedFile || rawTextInput) && (
                    <div className="space-y-4">
                      {selectedFile ? (
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={clearInputs}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <textarea
                            value={rawTextInput}
                            onChange={(e) => setRawTextInput(e.target.value)}
                            rows={12}
                            placeholder={t.pastePlaceholder}
                            className="w-full rounded-xl border border-slate-200 p-4 text-sm font-mono text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none"
                          />
                          <button
                            onClick={clearInputs}
                            className="absolute right-3 top-3 rounded-lg bg-white/90 p-1 text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            {t.analyzingBtn}
                          </>
                        ) : (
                          <>
                            {t.analyzeBtn}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3 text-red-800 text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                      <div className="w-full">
                        <p className="font-semibold">{t.errorTitle}</p>
                        <p className="mt-1.5 text-[11px] font-mono text-red-700 whitespace-pre-wrap leading-relaxed tracking-tight bg-white/50 p-2 rounded-md border border-red-100/50">{errorMsg}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">
                    {t.precisionGuarantees}
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{t.reasoningTitle}</h4>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {t.reasoningDesc}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{t.confidentialityTitle}</h4>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {t.confidentialityDesc}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{t.securityTitle}</h4>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {t.securityDesc}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Security and GDPR / APDP certifications and AES-256 */}
                <SecurityCertificates lang={lang} translations={t} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
              <div className="space-y-3 max-w-2xl">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors group"
                >
                  <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                  {t.backBtn}
                </button>
                 <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl leading-tight">
                  {sanitizeText(analysisResult.title)}
                </h2>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200/60 px-3 py-1.5 text-xs font-medium text-slate-700 leading-relaxed">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <strong>{lang === "fr" ? "Parties :" : "Parties:"}</strong> {analysisResult.parties.map(p => sanitizeText(p)).join(" • ")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200/60 px-3 py-1.5 text-xs font-medium text-slate-700 leading-relaxed">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <strong>{lang === "fr" ? "Durée :" : "Duration:"}</strong> {sanitizeText(analysisResult.duration)}
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-center gap-3 self-start md:self-center shrink-0">
                <button
                  onClick={() => exportAnalysis("pdf")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-xs hover:bg-rose-700 focus:outline-none transition-all cursor-pointer border border-rose-700 active:scale-[0.98]"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {t.exportPdf}
                </button>
                <button
                  onClick={() => exportAnalysis("md")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-xs hover:bg-slate-800 focus:outline-none transition-all cursor-pointer border border-slate-900 active:scale-[0.98]"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t.exportMd}
                </button>
                <button
                  onClick={() => exportAnalysis("txt")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[11px] font-extrabold text-slate-800 shadow-2xs hover:bg-slate-50 focus:outline-none transition-all cursor-pointer border border-slate-200 active:scale-[0.98]"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                  {t.exportTxt}
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex gap-1 border-b border-slate-200 bg-slate-100 p-1 rounded-xl relative overflow-x-auto flex-nowrap whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`relative flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer z-10 shrink-0 ${
                      activeTab === "summary"
                        ? "text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {activeTab === "summary" && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t.tabSummary}
                  </button>
                  <button
                    onClick={() => setActiveTab("risks")}
                    className={`relative flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer z-10 shrink-0 ${
                      activeTab === "risks"
                        ? "text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {activeTab === "risks" && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t.tabRisks} ({analysisResult.risks.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("obligations")}
                    className={`relative flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer z-10 shrink-0 ${
                      activeTab === "obligations"
                        ? "text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {activeTab === "obligations" && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t.tabObligations} ({analysisResult.obligations.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("termination")}
                    className={`relative flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer z-10 shrink-0 ${
                      activeTab === "termination"
                        ? "text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {activeTab === "termination" && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t.tabTermination}
                  </button>
                  <button
                    onClick={() => setActiveTab("compliance")}
                    className={`relative flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer z-10 shrink-0 ${
                      activeTab === "compliance"
                        ? "text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {activeTab === "compliance" && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t.tabCompliance}
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px]">
                  {activeTab === "summary" && (
                    <div className="space-y-6">
                      {/* Score global de conformité (Circular Gauge) */}
                      {(() => {
                        const score = (() => {
                          if (!analysisResult) return 100;
                          const high = analysisResult.risks.filter(r => r.level === "high").length;
                          const medium = analysisResult.risks.filter(r => r.level === "medium").length;
                          const low = analysisResult.risks.filter(r => r.level === "low").length;
                          const riskScore = (high * 22) + (medium * 9) + (low * 3.5);
                          
                          const textLen = rawTextInput ? rawTextInput.length : 4000;
                          const textBonus = Math.max(0.6, Math.min(1.4, textLen / 4500));
                          
                          const finalScore = Math.max(10, Math.min(100, Math.round(100 - (riskScore / textBonus))));
                          return finalScore;
                        })();

                        const radius = 36;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference * (1 - score / 100);

                        const strokeColor = 
                          score > 80 ? "stroke-emerald-500" :
                          score > 55 ? "stroke-amber-500" :
                          "stroke-rose-500";
                        
                        const strokeBgColor =
                          score > 80 ? "stroke-emerald-100 dark:stroke-emerald-950/40" :
                          score > 55 ? "stroke-amber-100 dark:stroke-amber-950/40" :
                          "stroke-rose-100 dark:stroke-rose-950/40";

                        const textColor = 
                          score > 80 ? "text-emerald-700 dark:text-emerald-400" :
                          score > 55 ? "text-amber-700 dark:text-amber-400" :
                          "text-rose-700 dark:text-rose-400";

                        const badgeBgColor =
                          score > 80 ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-850" :
                          score > 55 ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-850" :
                          "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-850";

                        return (
                          <div className={`flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border transition-all ${badgeBgColor}`}>
                            {/* Circular Gauge */}
                            <div className="relative flex items-center justify-center shrink-0">
                              <svg className="h-24 w-24 transform -rotate-90">
                                <circle
                                  cx="48"
                                  cy="48"
                                  r={radius}
                                  className={`fill-transparent ${strokeBgColor}`}
                                  strokeWidth="8"
                                />
                                <motion.circle
                                  cx="48"
                                  cy="48"
                                  r={radius}
                                  className={`fill-transparent ${strokeColor}`}
                                  strokeWidth="8"
                                  strokeDasharray={circumference}
                                  initial={{ strokeDashoffset: circumference }}
                                  animate={{ strokeDashoffset }}
                                  transition={{ duration: 1.2, ease: "easeOut" }}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center">
                                <span className={`text-2xl font-black tracking-tight ${textColor}`}>{score}</span>
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">/ 100</span>
                              </div>
                            </div>

                            {/* Score info and explanations */}
                            <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                  {lang === "fr" ? "Indice de Conformité Global" : "Global Compliance Index"}
                                </h4>
                                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border ${
                                  score > 80 ? "bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800" :
                                  score > 55 ? "bg-amber-100/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800" :
                                  "bg-rose-100/50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-800"
                                }`}>
                                  {score > 80 ? (lang === "fr" ? "Conforme" : "Compliant") :
                                   score > 55 ? (lang === "fr" ? "Vigilance Modérée" : "Moderate Warning") :
                                   (lang === "fr" ? "Risque Critique" : "Critical Risk")}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                                {lang === "fr"
                                  ? `Ce score est basé sur la densité de risques détectés par rapport au volume total analysé (${rawTextInput ? Math.round(rawTextInput.length / 5) : 800} mots). Un score élevé indique un contrat protecteur et conforme.`
                                  : `This score is calculated based on the density of detected risks in relation to the overall contract volume (${rawTextInput ? Math.round(rawTextInput.length / 5) : 800} words). A higher score indicates a protective, clean agreement.`}
                              </p>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-tight">
                                {lang === "fr"
                                  ? `Analyse : ${analysisResult.risks.length} risques identifiés • Contrat de ${rawTextInput ? rawTextInput.length : 4000} caractères`
                                  : `Metrics: ${analysisResult.risks.length} flagged warnings • ${rawTextInput ? rawTextInput.length : 4000} characters document`}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.summaryCardTitle}</h3>
                        <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                          <Markdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-slate-600">{highlightLegalTermsInNode(children, lang)}</li>,
                              strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                            }}
                          >
                            {analysisResult.summary}
                          </Markdown>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {t.fileNameTitle}
                          </h4>
                          <p className="text-sm font-semibold text-slate-900">{analysisResult.fileName}</p>
                          <p className="text-xs text-slate-400 mt-1">Format : {analysisResult.fileType} • {analysisResult.fileSize}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {t.durationTitle}
                          </h4>
                          <p className="text-sm font-semibold text-slate-900">{analysisResult.duration}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {lang === "fr" ? "Vérification de tacite reconduction recommandée" : "Tacit renewal verification recommended"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={() => triggerTranslation(analysisResult.summary)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          {t.transSummaryBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "risks" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {lang === "fr" ? "Clauses Risquées" : "Risky Clauses"}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {lang === "fr" ? "Points de vigilance requérant une attention ou renégociation" : "Vigilance points requiring attention or renegotiation"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          <button
                            onClick={() => setRiskFilter("all")}
                            className={`px-2 py-1 text-[10px] font-semibold rounded cursor-pointer ${
                              riskFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                            }`}
                          >
                            {t.risksFilterAll} ({analysisResult.risks.length})
                          </button>
                          <button
                            onClick={() => setRiskFilter("high")}
                            className={`px-2 py-1 text-[10px] font-semibold rounded cursor-pointer ${
                              riskFilter === "high" ? "bg-red-500 text-white shadow-xs" : "text-slate-600"
                            }`}
                          >
                            {t.risksFilterHigh} ({analysisResult.risks.filter((r) => r.level === "high").length})
                          </button>
                          <button
                            onClick={() => setRiskFilter("medium")}
                            className={`px-2 py-1 text-[10px] font-semibold rounded cursor-pointer ${
                              riskFilter === "medium" ? "bg-amber-500 text-white shadow-xs" : "text-slate-600"
                            }`}
                          >
                            {t.risksFilterMedium} ({analysisResult.risks.filter((r) => r.level === "medium").length})
                          </button>
                        </div>
                      </div>

                      {filteredRisks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                          <Shield className="h-10 w-10 mb-2 stroke-1" />
                          <p className="text-sm">{t.noRisksFound}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredRisks.map((item) => (
                            <div
                              key={item.id}
                              className={`rounded-xl border p-4 transition-all ${
                                item.level === "high"
                                  ? "bg-red-50/40 border-red-200"
                                  : item.level === "medium"
                                  ? "bg-amber-50/40 border-amber-200"
                                  : "bg-blue-50/30 border-blue-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                      item.level === "high"
                                        ? "bg-red-100 text-red-800"
                                        : item.level === "medium"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {lang === "fr"
                                      ? `Risque ${item.level === "high" ? "Élevé" : item.level === "medium" ? "Moyen" : "Faible"}`
                                      : `${item.level === "high" ? "High" : item.level === "medium" ? "Medium" : "Low"} Risk`}
                                  </span>
                                  <h4 className="text-sm font-bold text-slate-900">
                                    {sanitizeText(item.clause)}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => triggerTranslation(`${item.clause}\n\n${item.description}`)}
                                  className="text-slate-400 hover:text-slate-900 rounded p-1 cursor-pointer"
                                  title={t.transClauseBtn}
                                >
                                  <Globe className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="mt-3 space-y-3">
                                <div className="text-xs text-slate-600 leading-relaxed">
                                  <strong className="text-slate-800 block mb-1">{t.riskImpactLabel}</strong>
                                  <Markdown
                                    components={{
                                      p: ({ children }) => <p className="mb-1 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                      li: ({ children }) => <li className="text-slate-600">{highlightLegalTermsInNode(children, lang)}</li>,
                                      strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                                    }}
                                  >
                                    {item.description}
                                  </Markdown>
                                </div>
                                <div className="text-xs text-slate-700 bg-white rounded-lg p-2.5 border border-slate-200/50 leading-relaxed space-y-1">
                                  <strong className="text-slate-900 font-bold flex items-center gap-1 mb-1">
                                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                    {t.riskRecLabel}
                                  </strong>
                                  <Markdown
                                    components={{
                                      p: ({ children }) => <p className="mb-1 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                      li: ({ children }) => <li className="text-slate-700">{highlightLegalTermsInNode(children, lang)}</li>,
                                      strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                                    }}
                                  >
                                    {item.recommendation}
                                  </Markdown>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "obligations" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{t.obligationsTitle}</h3>
                          <p className="text-xs text-slate-500">{t.obligationsSubtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {t.obligationProgression} {completedObligationsCount} / {analysisResult.obligations.length}
                          </div>
                        </div>
                      </div>

                      {analysisResult.obligations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                          <CheckCircle className="h-10 w-10 mb-2 stroke-1" />
                          <p className="text-sm">{t.noObligationFound}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {analysisResult.obligations.map((item) => {
                            const isChecked = !!checkedObligations[item.id];
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleObligation(item.id)}
                                className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-slate-50 border-slate-200 opacity-60"
                                    : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className="mt-0.5">
                                  <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                                      isChecked
                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                        : "border-slate-300 bg-white"
                                    }`}
                                  >
                                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                                      {sanitizeText(item.party)}
                                    </span>
                                    {item.deadline && (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500">
                                        <Clock className="h-2.5 w-2.5" />
                                        {lang === "fr" ? "Échéance :" : "Deadline:"} {sanitizeText(item.deadline)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-1.5 text-xs text-slate-700 leading-relaxed">
                                    <Markdown
                                      components={{
                                        p: ({ children }) => <p className="mb-1 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                                        strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                                      }}
                                    >
                                      {item.description}
                                    </Markdown>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerTranslation(`Obligation [${item.party}] : ${item.description}`);
                                  }}
                                  className="text-slate-400 hover:text-slate-900 p-1 shrink-0 cursor-pointer"
                                  title={t.transClauseBtn}
                                >
                                  <Globe className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "termination" && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">{t.terminationTitle}</h3>
                        <p className="text-xs text-slate-500">{t.terminationSubtitle}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {t.terminationMechanism}
                          </h4>
                          <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                            <Markdown
                              components={{
                                p: ({ children }) => <span>{highlightLegalTermsInNode(children, lang)}</span>,
                                strong: ({ children }) => <strong className="font-extrabold">{highlightLegalTermsInNode(children, lang)}</strong>,
                              }}
                            >
                              {analysisResult.termination.mechanism}
                            </Markdown>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {t.terminationNotice}
                            </h4>
                            <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                              <Markdown
                                components={{
                                  p: ({ children }) => <span>{highlightLegalTermsInNode(children, lang)}</span>,
                                  strong: ({ children }) => <strong className="font-extrabold">{highlightLegalTermsInNode(children, lang)}</strong>,
                                }}
                              >
                                {analysisResult.termination.noticePeriod}
                              </Markdown>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {t.terminationPenalties}
                            </h4>
                            <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                              <Markdown
                                components={{
                                  p: ({ children }) => <span>{highlightLegalTermsInNode(children, lang)}</span>,
                                  strong: ({ children }) => <strong className="font-extrabold">{highlightLegalTermsInNode(children, lang)}</strong>,
                                }}
                              >
                                {analysisResult.termination.penalties}
                              </Markdown>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {t.terminationDetails}
                          </h4>
                          <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                            <Markdown
                              components={{
                                p: ({ children }) => <p className="mb-1 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                li: ({ children }) => <li className="text-slate-600">{highlightLegalTermsInNode(children, lang)}</li>,
                                strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                              }}
                            >
                              {analysisResult.termination.details}
                            </Markdown>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={() =>
                            triggerTranslation(
                              `Mécanismes: ${analysisResult.termination.mechanism}\nPréavis: ${analysisResult.termination.noticePeriod}\nPénalités: ${analysisResult.termination.penalties}\nDétails: ${analysisResult.termination.details}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          {t.transTerminationBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "compliance" && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">{t.complianceTitle}</h3>
                        <p className="text-xs text-slate-500">{t.complianceSubtitle}</p>
                      </div>

                      {analysisResult.compliance.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                          <CheckCircle className="h-10 w-10 mb-2 stroke-1" />
                          <p className="text-sm">{t.noComplianceFound}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {analysisResult.compliance.map((item) => (
                            <div key={item.id} className="rounded-xl border border-slate-200 bg-white shadow-xs">
                              <div className="flex items-center justify-between gap-4 bg-slate-50 px-4 py-3 border-b border-slate-200/70 rounded-t-xl">
                                <span className="font-bold text-xs text-slate-900">
                                  {sanitizeText(item.subject)}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    item.status === "compliant"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : item.status === "warning"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.status === "compliant"
                                    ? t.complianceStatusOk
                                    : item.status === "warning"
                                    ? t.complianceStatusWarning
                                    : t.complianceStatusDanger}
                                </span>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="text-xs text-slate-600 leading-relaxed">
                                  <strong className="text-slate-800 block mb-1">
                                    {lang === "fr" ? "Évaluation :" : "Evaluation:"}
                                  </strong>
                                  <Markdown
                                    components={{
                                      p: ({ children }) => <p className="mb-1 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                      li: ({ children }) => <li className="text-slate-600">{highlightLegalTermsInNode(children, lang)}</li>,
                                      strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                                    }}
                                  >
                                    {item.details}
                                  </Markdown>
                                </div>
                                {item.remedy && (
                                  <div className="text-xs text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-200/50 leading-relaxed space-y-1">
                                    <strong className="text-slate-900 font-bold block mb-1">
                                      {t.complianceRemedy}
                                    </strong>
                                    <Markdown
                                      components={{
                                        p: ({ children }) => <p className="mb-1 last:mb-0">{highlightLegalTermsInNode(children, lang)}</p>,
                                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                        li: ({ children }) => <li className="text-slate-700">{highlightLegalTermsInNode(children, lang)}</li>,
                                        strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{highlightLegalTermsInNode(children, lang)}</strong>,
                                      }}
                                    >
                                      {item.remedy}
                                    </Markdown>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">
                    {t.translationWidgetTitle}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t.translateTo}
                      </label>
                      <select
                        value={translationLang}
                        onChange={(e) => setTranslationLang(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-slate-800 focus:outline-none"
                      >
                        <option value="en">Anglais (English)</option>
                        <option value="ar">Arabe (العربية)</option>
                        <option value="pt">Portugais (Português)</option>
                        <option value="es">Espagnol (Español)</option>
                        <option value="de">Allemand (Deutsch)</option>
                        <option value="it">Italien (Italiano)</option>
                        <option value="zh">Chinois (中文)</option>
                        <option value="ja">Japonais (日本語)</option>
                        <option value="ru">Russe (Русский)</option>
                        <option value="fr">Français (Français)</option>
                      </select>
                    </div>

                    {!translationSource ? (
                      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400 text-xs leading-relaxed">
                        {t.translationWidgetDesc}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t.sourceLanguageLabel}</p>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{translationSource}</p>
                        </div>

                        <button
                          onClick={() => triggerTranslation(translationSource)}
                          disabled={isTranslating}
                          className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          {isTranslating ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              {t.translatingBtn}
                            </>
                          ) : (
                            <>
                              <Globe className="h-3.5 w-3.5" />
                              {t.translateBtn}
                            </>
                          )}
                        </button>

                        {translatedContent && (
                          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                              <span>{t.translatedTextLabel}</span>
                              <span className="font-mono text-slate-400">{translationLang.toUpperCase()}</span>
                            </p>
                            <div className="text-xs text-slate-800 leading-relaxed space-y-1">
                              <Markdown
                                components={{
                                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                  li: ({ children }) => <li className="text-slate-800">{children}</li>,
                                  strong: ({ children }) => <strong className="font-bold text-slate-950 bg-amber-100/70 px-1 rounded-sm border-b border-amber-200/50">{children}</strong>,
                                }}
                              >
                                {translatedContent}
                              </Markdown>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-3">
                    {t.securityArchiving}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {t.securityArchivingDesc}
                  </p>
                  <button
                    onClick={() => setAnalysisResult(null)}
                    className="w-full rounded-lg border border-red-200 text-red-600 hover:bg-red-50 px-2.5 py-1.5 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {t.clearDataBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-4">
          <p className="text-xs text-slate-500 text-center max-w-2xl leading-relaxed">
            {t.footerText}
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap flex-nowrap">
            <span>{t.footerRgpd}</span>
            <span className="text-slate-300 select-none">•</span>
            <span>{t.footerAes}</span>
            <span className="text-slate-300 select-none">•</span>
            <span>{t.footerApdp}</span>
          </div>
        </div>
      </footer>

      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        lang={lang} 
      />
    </div>
  );
}
