import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Share2, Mail, Linkedin, Twitter, MessageSquare, ExternalLink } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "fr" | "en";
}

export default function ShareModal({ isOpen, onClose, lang }: ShareModalProps) {
  const isFr = lang === "fr";
  const [copied, setCopied] = useState(false);

  // We fetch the actual application URL from the window location or fallback
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://thus-l8.ai";

  // High-quality error correction (ecc=H) is used so the centered logo does not disrupt QR readability
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(siteUrl)}&ecc=H&color=0f172a`;

  const shareText = isFr
    ? "Ainsi, j'analyse mes contrats instantanément et en toute sécurité avec Thus L8 ! Viens tester et donner ton avis : "
    : "Accordingly, I analyze my contracts instantly and securely with Thus L8! Come test and share your thoughts: ";

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + siteUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(isFr ? "Découvre Thus L8 — Analyse contractuelle IA d'excellence" : "Discover Thus L8 — Elite AI Contract Analysis")}&body=${encodeURIComponent(shareText + siteUrl)}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden z-10 p-4 sm:p-5 flex flex-col gap-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center focus:outline-none cursor-pointer z-20"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Header section with title */}
          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center gap-1.5 text-slate-800">
              <Share2 className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
                {isFr ? "Partager l'application" : "Share the Application"}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight font-sans">
              {isFr ? "Faites découvrir Thus L8" : "Introduce Thus L8"}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isFr 
                ? "Faites tester cet assistant d'analyse contractuelle d'excellence à votre réseau." 
                : "Have your network experience this elite AI contract assistant."}
            </p>
          </div>

          {/* Main Side-by-Side Grid (QR & Share Links) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* QR Code Column */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-2 rounded-xl relative shadow-2xs group">
              <div className="relative h-24 w-24 flex items-center justify-center bg-white rounded-lg p-1 shadow-3xs border border-slate-100">
                <img
                  src={qrUrl}
                  alt="Thus L8 QR"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute h-6 w-6 bg-white rounded-md shadow-xs border border-slate-100 flex items-center justify-center z-10">
                  <span className="bg-slate-950 text-white px-1 py-0.2 rounded font-mono text-[6px] tracking-widest font-black">
                    L8
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-600 mt-1.5 font-mono tracking-wide">
                thus-l8.ai
              </span>
            </div>

            {/* Sharing Methods Column */}
            <div className="sm:col-span-7 space-y-2">
              <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider uppercase block">
                {isFr ? "PARTAGER VIA" : "SHARE VIA"}
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-700 hover:text-slate-950 transition-all text-[11px] font-bold"
                >
                  <Linkedin className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-150 text-slate-700 hover:text-sky-700 transition-all text-[11px] font-bold"
                >
                  <Twitter className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span>X / Twitter</span>
                </a>

                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-150 text-slate-700 hover:text-emerald-700 transition-all text-[11px] font-bold"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={shareLinks.email}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-150 text-slate-700 hover:text-amber-700 transition-all text-[11px] font-bold"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Email</span>
                </a>
              </div>

              {/* Copy URL */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-all text-[11px] font-bold shadow-2xs active:scale-98 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span>{copied ? (isFr ? "Lien copié !" : "Link copied!") : (isFr ? "Copier le lien" : "Copy website link")}</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Slogan invitation text */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10.5px] text-slate-700 leading-relaxed font-medium">
            {isFr ? (
              <>
                <span className="font-extrabold text-slate-900">Faites grandir la communauté !</span> Invitez vos contacts à tester Thus L8 pour décrypter leurs documents et contrats sans aucun stockage permanent.
              </>
            ) : (
              <>
                <span className="font-extrabold text-slate-900">Grow our community!</span> Invite your peers to test Thus L8 to decipher documents and contracts with zero permanent storage.
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
