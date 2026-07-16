import React from "react";
import { Shield, Cpu, Info, Share2, ArrowLeft, Mail } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;
  showContact: boolean;
  setShowContact: (show: boolean) => void;
  onShare: () => void;
}

export default function Header({ 
  lang, 
  setLang, 
  showAbout, 
  setShowAbout, 
  showContact, 
  setShowContact, 
  onShare 
}: HeaderProps) {
  const handleLogoClick = () => {
    setShowAbout(false);
    setShowContact(false);
  };

  const handleAboutClick = () => {
    setShowContact(false);
    setShowAbout(!showAbout);
  };

  const handleContactClick = () => {
    setShowAbout(false);
    setShowContact(!showContact);
  };

  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-center w-full sm:w-auto">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-1.5 cursor-pointer text-left focus:outline-none hover:opacity-95 active:scale-98 transition-all"
            >
              <h1 className="text-lg font-black tracking-tight text-slate-950 flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent">Thus</span>
                <span className="bg-slate-950 text-white px-2 py-0.5 rounded-lg font-mono text-xs tracking-widest font-black shadow-sm">L8</span>
              </h1>
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Bouton À propos (About) */}
            <button
              onClick={handleAboutClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-3xs ${
                showAbout
                  ? "bg-slate-950 text-white border-slate-950"
                  : "bg-white text-slate-700 border-slate-200 hover:text-slate-950 hover:bg-slate-50"
              }`}
              title={lang === "fr" ? "En savoir plus sur Thus L8" : "Learn more about Thus L8"}
            >
              <Info className="h-3.5 w-3.5" />
              <span>{lang === "fr" ? "À propos" : "About"}</span>
            </button>

            {/* Bouton Contact placé après À propos */}
            <button
              onClick={handleContactClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-3xs ${
                showContact
                  ? "bg-slate-950 text-white border-slate-950"
                  : "bg-white text-slate-700 border-slate-200 hover:text-slate-950 hover:bg-slate-50"
              }`}
              title={lang === "fr" ? "Nous contacter" : "Contact us"}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{lang === "fr" ? "Contact" : "Contact"}</span>
            </button>

            {/* Bouton de Partage */}
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs"
              title={lang === "fr" ? "Partager l'application" : "Share the application"}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === "fr" ? "Partager" : "Share"}</span>
            </button>

            {/* Sélecteur de langue esthétique et discret */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 shadow-xs shrink-0 relative">
              <button
                onClick={() => setLang("fr")}
                className={`relative px-2 py-1 text-[10px] font-bold rounded-md transition-colors duration-200 cursor-pointer z-10 ${
                  lang === "fr"
                    ? "text-slate-950 font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "fr" && (
                  <motion.span
                    layoutId="activeLang"
                    className="absolute inset-0 bg-white rounded-md shadow-2xs -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                FR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`relative px-2 py-1 text-[10px] font-bold rounded-md transition-colors duration-200 cursor-pointer z-10 ${
                  lang === "en"
                    ? "text-slate-950 font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang === "en" && (
                  <motion.span
                    layoutId="activeLang"
                    className="absolute inset-0 bg-white rounded-md shadow-2xs -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

