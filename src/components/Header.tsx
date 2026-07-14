import React from "react";
import { Shield, Cpu, Languages } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-xs">
              <Shield className="h-4 sm:h-5 w-4 sm:w-5 stroke-[1.75]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg flex items-center gap-1.5">
                <span>Thus</span>
                <span className="bg-slate-950 text-white px-1.5 py-0.5 rounded-md font-mono text-xs tracking-widest font-black shadow-xs">L8</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5">
              <Languages className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {lang === "fr" ? "Moteur d'évaluation de précision L.8" : "L.8 Precision Evaluation Engine"}
              </span>
            </div>

            {/* Sélecteur de langue esthétique et discret */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 shadow-xs shrink-0 relative">
              <button
                onClick={() => setLang("fr")}
                className={`relative px-2 py-1 text-[10px] font-bold rounded-md transition-colors duration-200 cursor-pointer z-10 ${
                  lang === "fr" ? "text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"
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
                  lang === "en" ? "text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"
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
