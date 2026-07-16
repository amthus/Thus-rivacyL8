import React, { useState } from "react";
import { ArrowLeft, Send, MessageCircle, Mail, User, Compass, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { allCountries } from "country-telephone-data";

interface ContactViewProps {
  lang: "fr" | "en";
  onClose: () => void;
}

interface CountryData {
  name: string;
  iso2: string;
  dialCode: string;
}

export default function ContactView({ lang, onClose }: ContactViewProps) {
  const isFr = lang === "fr";

  const [fullName, setFullName] = useState("");
  const [source, setSource] = useState("");
  const [msgType, setMsgType] = useState<"conseil" | "innovation" | "apport">("conseil");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  
  const [countryCode, setCountryCode] = useState("+229");
  const [phoneNum, setPhoneNum] = useState("");

  const [emailAddr, setEmailAddr] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const countriesList: CountryData[] = (allCountries as any[])
    .map((c) => ({
      name: c.name.split(" (")[0],
      iso2: c.iso2,
      dialCode: `+${c.dialCode}`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !message.trim()) {
      setErrorMsg(isFr ? "Veuillez remplir tous les champs obligatoires." : "Please fill in all required fields.");
      return;
    }

    if (channel === "whatsapp" && !phoneNum.trim()) {
      setErrorMsg(isFr ? "Veuillez entrer votre numero de telephone." : "Please enter your phone number.");
      return;
    }

    if (channel === "email" && !emailAddr.trim()) {
      setErrorMsg(isFr ? "Veuillez entrer votre adresse e-mail." : "Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const typeLabel = {
        conseil: isFr ? "Conseil" : "Advice",
        innovation: isFr ? "Innovation" : "Innovation",
        apport: isFr ? "Apport" : "Contribution / Feedback"
      }[msgType];

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          source: source.trim() || (isFr ? "Non specifie" : "Not specified"),
          msgType: typeLabel,
          message: message.trim(),
          channel,
          countryCode: channel === "whatsapp" ? countryCode : undefined,
          phoneNum: channel === "whatsapp" ? phoneNum.trim() : undefined,
          emailAddr: channel === "email" ? emailAddr.trim() : undefined
        })
      });

      if (!response.ok) {
        throw new Error("Server response error");
      }

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        throw new Error(data.error || "Failed to send");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(isFr ? "Impossible d'envoyer le message. Veuillez reessayer." : "Failed to send the message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {isFr ? "Message envoye" : "Message Sent"}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {isFr
              ? "Votre message a ete transmis avec succes en arriere-plan de maniere securisee."
              : "Your message has been successfully and securely transmitted in the background."}
          </p>
        </div>
        <div className="pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            {isFr ? "Retourner a l'analyseur" : "Return to Analyzer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Back button */}
      <div className="flex items-center">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFr ? "Retour a l'analyseur" : "Back to Analyzer"}
        </button>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {isFr ? "Contactez-nous" : "Contact Us"}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          {isFr 
            ? "Une idee d'innovation, un conseil ou un apport a nous partager ? Ecrivez-nous directement."
            : "An innovation idea, advice or a contribution to share? Write to us directly."}
        </p>
      </div>

      {/* Main form container */}
      <div className="max-w-2xl mx-auto bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-950 rounded-xl border border-rose-100 text-xs font-medium">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {isFr ? "Nom Complet" : "Full Name"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isFr ? "Ex: Jean Dupont" : "e.g. John Doe"}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium placeholder-slate-400"
            />
          </div>

          {/* Source Info */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Compass className="h-3.5 w-3.5 text-slate-400" />
              {isFr ? "Comment avez-vous connu l'application ?" : "How did you hear about the app?"}
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={isFr ? "Ex: Reseaux sociaux, recherche Google, ami..." : "e.g. Social media, Google search, friend..."}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium placeholder-slate-400"
            />
          </div>

          {/* Message Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              {isFr ? "Nature de votre message" : "Nature of your message"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "conseil", labelFr: "Conseil", labelEn: "Advice" },
                { id: "innovation", labelFr: "Innovation", labelEn: "Innovation" },
                { id: "apport", labelFr: "Apport", labelEn: "Feedback" }
              ].map((item) => {
                const isActive = msgType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMsgType(item.id as any)}
                    className={`py-2 rounded-xl border text-[10px] sm:text-xs font-extrabold transition-all text-center cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {isFr ? item.labelFr : item.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {isFr ? "Votre Message" : "Your Message"} <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isFr ? "Saisissez les details de votre message..." : "Type your message details here..."}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs sm:text-sm font-medium placeholder-slate-400 resize-y min-h-[100px]"
            />
          </div>

          {/* Transmission Channel Selection */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {isFr ? "Canal d'envoi" : "Sending Channel"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp Option */}
              <button
                type="button"
                onClick={() => setChannel("whatsapp")}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  channel === "whatsapp"
                    ? "border-emerald-500 bg-emerald-50/10 text-emerald-950"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${channel === "whatsapp" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{isFr ? "WhatsApp" : "WhatsApp"}</div>
                  </div>
                </div>
                <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                  channel === "whatsapp" ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                }`}>
                  {channel === "whatsapp" && <div className="h-1 w-1 rounded-full bg-white" />}
                </div>
              </button>

              {/* Email Option */}
              <button
                type="button"
                onClick={() => setChannel("email")}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  channel === "email"
                    ? "border-indigo-500 bg-indigo-50/10 text-indigo-950"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${channel === "email" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{isFr ? "E-mail" : "Email"}</div>
                  </div>
                </div>
                <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                  channel === "email" ? "border-indigo-500 bg-indigo-500" : "border-slate-300"
                }`}>
                  {channel === "email" && <div className="h-1 w-1 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Input based on Selected Channel */}
          {channel === "whatsapp" ? (
            <div className="space-y-1.5 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {isFr ? "Votre numero WhatsApp" : "Your WhatsApp Number"} <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 max-w-[130px] cursor-pointer"
                >
                  {countriesList.map((c) => (
                    <option key={`${c.iso2}-${c.dialCode}`} value={c.dialCode}>
                      {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value.replace(/\D/g, ""))}
                  placeholder={isFr ? "Numero" : "Number"}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs sm:text-sm font-medium placeholder-slate-400"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {isFr ? "Votre adresse e-mail" : "Your Email Address"} <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
                placeholder={isFr ? "Ex: jean.dupont@email.com" : "e.g. john.doe@email.com"}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs sm:text-sm font-medium placeholder-slate-400"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-slate-950 hover:bg-slate-900 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>
              {isSubmitting 
                ? (isFr ? "Envoi en cours..." : "Sending...")
                : (isFr 
                    ? `Envoyer via ${channel === "whatsapp" ? "WhatsApp" : "E-mail"}` 
                    : `Send via ${channel === "whatsapp" ? "WhatsApp" : "Email"}`)
              }
            </span>
          </button>

        </form>
      </div>
    </div>
  );
}
