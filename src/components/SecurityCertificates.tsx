import React from "react";
import { Shield, Lock, FileText, Clock } from "lucide-react";

interface SecurityCertificatesProps {
  lang: "fr" | "en";
  translations: any;
}

export default function SecurityCertificates({ lang, translations: t }: SecurityCertificatesProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-600" />
          {t.securityGuaranteesTitle}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          {t.securityGuaranteesSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* GDPR */}
        <div className="flex gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 leading-none">
              <span>{t.gdprLabel}</span>
              <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 bg-emerald-100/50 text-emerald-800 rounded">RGPD</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {t.gdprDesc}
            </p>
          </div>
        </div>

        {/* AES-256 */}
        <div className="flex gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 leading-none">
              <span>{t.aesLabel}</span>
              <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 bg-amber-100/50 text-amber-800 rounded">MILITARY</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {t.aesDesc}
            </p>
          </div>
        </div>

        {/* APDP */}
        <div className="flex gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 leading-none">
              <span>{t.apdpLabel}</span>
              <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 bg-blue-100/50 text-blue-800 rounded">APDP</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {t.apdpDesc}
            </p>
          </div>
        </div>

        {/* Ephemeral RAM */}
        <div className="flex gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 leading-none">
              <span>{t.ephemeralLabel}</span>
              <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded">100% RAM</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {t.ephemeralDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
