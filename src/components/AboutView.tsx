import React from "react";
import { motion } from "motion/react";
import { 
  Shield, 
  Cpu, 
  Sparkles, 
  Compass, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  BookOpen, 
  Workflow, 
  Scale,
  ShieldCheck,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from "lucide-react";

interface AboutViewProps {
  lang: "fr" | "en";
  onClose: () => void;
}

export default function AboutView({ lang, onClose }: AboutViewProps) {
  const isFr = lang === "fr";
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const content = {
    fr: {
      title: "À propos de Thus L8",
      subtitle: "La fusion de la rigueur juridique et de l'intelligence artificielle avancée.",
      tagline: "CONFIANCE • PRÉCISION • SÉCURITÉ",
      storyTitle: "Notre Vision",
      storyText: (
        <span>
          Les contrats régissent les affaires, mais leur complexité ralentit l'innovation. Thus L8 est né d'une ambition claire : démocratiser l'analyse contractuelle de haut niveau en combinant l'expertise juridique traditionnelle et la puissance cognitive des derniers modèles de langage d'IA. Ainsi, notre solution permet d'analyser, de vulgariser, de résumer et d'auditer des <span className="text-violet-600 font-bold">contrats complexes</span> ainsi que tous types de documents professionnels (<span className="text-violet-600 font-bold">commerciaux, techniques, administratifs ou juridiques</span>). Nous offrons aux <span className="text-slate-950 font-extrabold bg-slate-100 px-1.5 py-0.5 rounded-md">entrepreneurs, juristes et décideurs</span> un outil d'audit instantané, précis et extrêmement protecteur pour déceler les opportunités, sécuriser les clauses de résiliation et clarifier chaque obligation opérationnelle.
        </span>
      ),
      
      p1Title: "Audit Juridique Profond",
      p1Desc: "Contrairement aux analyses superficielles qui se limitent à de simples mots-clés, Thus L8 scanne l'intégralité du document pour cartographier exhaustivement les risques (niveaux Élevé, Moyen, Faible), isoler chaque obligation opérationnelle et disséquer les clauses de résiliation complexes.",
      
      p2Title: "Moteur de Précision L.8",
      p2Desc: "Propulsé par les modèles d'IA de dernière génération de Google DeepMind exécutés côté serveur, notre moteur applique des règles de décryptage sémantique rigoureuses. Chaque analyse est corrélée à notre dictionnaire de termes légaux pour une fiabilité inégalée.",
      
      p3Title: "Secret Professionnel & Sécurité",
      p3Desc: (
        <span>
          Vos données contractuelles sont hautement <span className="text-emerald-600 font-extrabold underline decoration-emerald-300 underline-offset-4">confidentielles</span>. Thus L8 est conçu selon des principes de sécurité rigoureux : l'intégralité des requêtes est traitée de manière éphémère sur des serveurs sécurisés <span className="text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded-md">sans aucun stockage</span> persistant de vos documents originaux.
        </span>
      ),
      
      metricsTitle: "Ainsi s'établit la norme Thus L8",
      metric1Val: "100%",
      metric1Lbl: "Confidentialité garantie",
      metric2Val: "< 15s",
      metric2Lbl: "Temps moyen de décryptage",
      metric3Val: "30+",
      metric3Lbl: "Points de contrôle simultanés",
      
      howItWorks: "Comment ça fonctionne ?",
      step1: "1. Chargement",
      step1Desc: "Copiez-collez votre texte ou déposez un fichier de contrat directement dans l'interface sécurisée.",
      step2: "2. Analyse Cognitive",
      step2Desc: "L'IA examine l'équilibre contractuel, la conformité légale (RGPD, responsabilité) et les engagements réciproques.",
      step3: "3. Restitution Assistée",
      step3Desc: "Consultez un rapport structuré avec calcul automatique de l'indice de conformité globale, dictionnaire interactive et liste de contrôle.",
      
      backBtn: "Retour à l'analyseur"
    },
    en: {
      title: "About Thus L8",
      subtitle: "The convergence of legal rigor and advanced artificial intelligence.",
      tagline: "TRUST • PRECISION • SECURITY",
      storyTitle: "Our Vision",
      storyText: (
        <span>
          Contracts govern business, but their complexity slows down innovation. Thus L8 was born from a clear ambition: to democratize high-level contract analysis by combining traditional legal expertise with the cognitive power of the latest AI language models. Accordingly, our solution makes it possible to analyze, simplify, summarize, and audit <span className="text-violet-600 font-bold">complex contracts</span> as well as all types of professional documents (<span className="text-violet-600 font-bold">commercial, technical, administrative, or legal</span>). We offer <span className="text-slate-950 font-extrabold bg-slate-100 px-1.5 py-0.5 rounded-md">entrepreneurs, lawyers, and decision-makers</span> an instant, precise, and highly protective audit tool to detect opportunities, secure termination clauses, and clarify every operational obligation.
        </span>
      ),
      
      p1Title: "Deep Legal Audit",
      p1Desc: "Unlike superficial analysis tools restricted to simple keyword matching, Thus L8 scans the entire document to comprehensively map out risks (High, Medium, Low), isolate every operational obligation, and dissect complex termination conditions.",
      
      p2Title: "L.8 Precision Engine",
      p2Desc: "Powered by the latest generation Google DeepMind AI models executed server-side, our engine applies rigorous semantic analysis. Every audit is cross-referenced with our legal glossary to ensure unmatched reliability.",
      
      p3Title: "Confidentiality & Security",
      p3Desc: (
        <span>
          Your contract data is highly <span className="text-emerald-600 font-extrabold underline decoration-emerald-300 underline-offset-4">confidential</span>. Thus L8 is designed with strict security principles: all requests are processed ephemerally on secure servers <span className="text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded-md">without any persistent storage</span> of your original documents.
        </span>
      ),
      
      metricsTitle: "How Thus L8 Sets the Standard",
      metric1Val: "100%",
      metric1Lbl: "Guaranteed Confidentiality",
      metric2Val: "< 15s",
      metric2Lbl: "Average Decryption Time",
      metric3Val: "30+",
      metric3Lbl: "Simultaneous Checkpoints",
      
      howItWorks: "How It Works",
      step1: "1. Upload",
      step1Desc: "Copy-paste your text or drop your contract document directly into our secure interface.",
      step2: "2. Cognitive Audit",
      step2Desc: "The AI inspects contractual balance, legal compliance (GDPR, liability limits), and reciprocal covenants.",
      step3: "3. Guided Restitution",
      step3Desc: "Access a structured report with an interactive compliance score, live definitions glossary, and checklist tracker.",
      
      backBtn: "Back to Analyzer"
    }
  };

  const t = isFr ? content.fr : content.en;

  return (
    <div className="space-y-12 pb-16">
      {/* Bouton de retour en haut */}
      <div className="flex items-center">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backBtn}
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-mono tracking-widest font-black uppercase">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>{t.tagline}</span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t.title}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Storytelling block */}
      <div className="grid gap-8 md:grid-cols-12 items-stretch">
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-center space-y-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Scale className="h-32 w-32 text-slate-900" />
          </div>
          <div className="flex items-center gap-2 text-indigo-600">
            <BookOpen className="h-5 w-5" />
            <h3 className="text-sm font-black uppercase tracking-wider font-mono">{t.storyTitle}</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {t.storyText}
          </p>
        </div>

        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          {/* Ambient light effects inside the container */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_60%)] pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/15 transition-all duration-700" />
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase tracking-widest font-bold">
              {isFr ? "EXCELLENCE OPÉRATIONNELLE" : "OPERATIONAL EXCELLENCE"}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight font-sans text-indigo-300 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                {t.metricsTitle}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {isFr 
                  ? "Une ingénierie de précision pour un diagnostic rapide, fiable et sans compromis."
                  : "Precision engineering for a fast, reliable, and compromise-free diagnosis."}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-slate-800/80 relative z-10">
            {/* Metric 1 */}
            <div className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-white/5 transition-all duration-300">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-2xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                  <span>{t.metric1Val}</span>
                  <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold tracking-widest bg-emerald-500/10 px-1 py-0.2 rounded">SECURE</span>
                </div>
                <div className="text-xs text-slate-300 font-bold leading-tight">{t.metric1Lbl}</div>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  {isFr ? "Sécurité absolue. Zéro stockage permanent." : "Ultimate security. Zero permanent storage."}
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-white/5 transition-all duration-300">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-2xs">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                  <span>{t.metric2Val}</span>
                  <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-widest bg-amber-500/10 px-1 py-0.2 rounded">ULTRA-FAST</span>
                </div>
                <div className="text-xs text-slate-300 font-bold leading-tight">{t.metric2Lbl}</div>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  {isFr ? "Décryptage instantané de vos clauses." : "Instant clause analysis and extraction."}
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-white/5 transition-all duration-300">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xs">
                <Activity className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                  <span>{t.metric3Val}</span>
                  <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold tracking-widest bg-indigo-500/10 px-1 py-0.2 rounded">EXHAUSTIVE</span>
                </div>
                <div className="text-xs text-slate-300 font-bold leading-tight">{t.metric3Lbl}</div>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  {isFr ? "Vérification complète à 360°." : "Full 360° risk and liability check."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
            {isFr ? "NOS PILIERS DE FIABILITÉ" : "OUR KEY PILLARS"}
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shadow-3xs">
              <Scale className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">{t.p1Title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.p1Desc}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-3xs">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">{t.p2Title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.p2Desc}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-3xs">
              <Lock className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-950">{t.p3Title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.p3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-slate-100/50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-black text-slate-900 tracking-tight">{t.howItWorks}</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{t.step1}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.step1Desc}
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{t.step2}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.step2Desc}
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{t.step3}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">FAQ</h3>
          <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isFr ? "Questions Fréquentes" : "Frequently Asked Questions"}
          </h4>
          <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
            {isFr 
              ? "Des réponses claires concernant l'intégrité de vos documents et l'utilisation de l'intelligence artificielle."
              : "Clear answers regarding your document integrity and artificial intelligence usage."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              q: isFr ? "Où sont stockées mes données contractuelles ?" : "Where is my contract data stored?",
              a: isFr 
                ? "Zéro stockage permanent. Toutes les analyses sont traitées de manière totalement éphémère et uniquement en mémoire vive (RAM) sur nos serveurs hautement sécurisés. Dès que vous fermez l'onglet ou réinitialisez l'analyseur, toutes les traces de votre document sont définitivement purgées de l'environnement."
                : "Zero permanent storage. All audits are processed ephemerally and solely in random access memory (RAM) on our highly secure servers. The moment you close the tab or reset the analyzer, all traces of your document are permanently purged from the environment."
            },
            {
              q: isFr ? "Quel modèle d'intelligence artificielle est utilisé ?" : "Which AI model is used?",
              a: isFr
                ? "Thus L8 est propulsé par les derniers modèles de langage avancés de Google DeepMind (Gemini 1.5/2.0 Pro) exécutés de manière sécurisée côté serveur. Ces modèles analysent la structure sémantique globale plutôt que de simples mots-clés."
                : "Thus L8 is powered by the latest generation Google DeepMind advanced language models (Gemini 1.5/2.0 Pro) executed securely on the server side. These models analyze the entire semantic structure rather than simple keywords."
            },
            {
              q: isFr ? "Ainsi L8 remplace-t-il un avocat-conseil ?" : "Does Thus L8 replace a legal counsel?",
              a: isFr
                ? "Non. Thus L8 est un outil de diagnostic rapide et d'assistance cognitive conçu pour déceler les risques, vulgariser les termes complexes et accélérer votre relecture. Il ne constitue pas un conseil juridique officiel et ne remplace pas l'avis d'un professionnel du droit agréé."
                : "No. Thus L8 is a rapid diagnostic tool and a cognitive assistant designed to detect risks, simplify complex terms, and accelerate your proofreading. It does not constitute official legal advice and does not replace the counsel of a licensed attorney."
            },
            {
              q: isFr ? "Quels types de documents professionnels puis-je analyser ?" : "What types of professional documents can I analyze?",
              a: isFr
                ? "Vous pouvez analyser tout type de document professionnel complexe : contrats commerciaux, accords de confidentialité (NDA), contrats de prestation de services, conditions de vente (CGV/CGU), ainsi que des documents administratifs ou techniques nécessitant une relecture critique."
                : "You can analyze any type of complex professional document: commercial agreements, non-disclosure agreements (NDAs), service level agreements (SLAs), terms of service (TOS/EULA), as well as administrative or technical papers requiring critical proofreading."
            }
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 shadow-3xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors duration-150 focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span className="text-xs sm:text-sm tracking-tight">{item.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action back */}
      <div className="text-center pt-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black text-white bg-slate-950 hover:bg-slate-900 active:scale-98 rounded-xl transition-all cursor-pointer shadow-md"
        >
          {t.backBtn}
        </button>
      </div>
    </div>
  );
}
