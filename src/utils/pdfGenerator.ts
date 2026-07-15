import { jsPDF } from "jspdf";
import { ContractAnalysis } from "../types";

function sanitizeText(str: string | undefined | null): string {
  if (!str) return "";
  // Remove markdown bold asterisks and other simple characters to make PDF text clean
  return str.replace(/\*\*/g, "").replace(/\*/g, "").trim();
}

export function generatePDF(analysis: ContractAnalysis, lang: "fr" | "en") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin; // 180mm

  let y = 20;

  // Helper to verify if we need a new page before drawing
  const checkPageOverflow = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 25) {
      doc.addPage();
      y = 20;
      drawPageHeader();
    }
  };

  // Helper to draw a subtle top header on every page except page 1
  const drawPageHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    const headerTitle = lang === "fr" 
      ? "THUSL8 • RAPPORT D'AUDIT DE DOCUMENT JURIDIQUE & TECHNIQUE" 
      : "THUSL8 • LEGAL & TECHNICAL DOCUMENT AUDIT REPORT";
    doc.text(headerTitle, margin, 12);
    
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.setLineWidth(0.5);
    doc.line(margin, 14, pageWidth - margin, 14);
  };

  // ----------------------------------------------------
  // PAGE 1: TITLE & COVER INFO
  // ----------------------------------------------------
  
  // App brand logo & header
  doc.setFillColor(15, 23, 42); // slate-900 (deep slate navy)
  doc.rect(margin, y, contentWidth, 24, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("THUSL8 • LEGALTECH ENGINE", margin + 6, y + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const subtitleStr = lang === "fr" 
    ? "Audit automatique augmenté par Intelligence Artificielle" 
    : "AI-Augmented Automated Compliance & Audit Platform";
  doc.text(subtitleStr, margin + 6, y + 17);
  
  // Date of the report
  const dateStr = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateLabel = lang === "fr" ? `Généré le : ${dateStr}` : `Generated on: ${dateStr}`;
  doc.text(dateLabel, pageWidth - margin - 6 - doc.getTextWidth(dateLabel), y + 14);

  y += 34;

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = doc.splitTextToSize(sanitizeText(analysis.title), contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 4;

  // Metadata Card
  checkPageOverflow(35);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  
  doc.text(lang === "fr" ? "FICHIER SOURCE :" : "SOURCE DOCUMENT:", margin + 5, y + 6);
  doc.text(lang === "fr" ? "PARTIES CONCERNÉES :" : "CONCERNED PARTIES:", margin + 5, y + 14);
  doc.text(lang === "fr" ? "DURÉE / VALIDITÉ :" : "DURATION / VALIDITY:", margin + 5, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42); // slate-900
  
  const sourceVal = sanitizeText(analysis.fileName ? `${analysis.fileName} (${analysis.fileSize || "N/A"})` : "Texte brut saisi / Raw text input");
  doc.text(doc.splitTextToSize(sourceVal, contentWidth - 45), margin + 42, y + 6);
  
  const partiesVal = sanitizeText(analysis.parties.join(" • "));
  doc.text(doc.splitTextToSize(partiesVal, contentWidth - 45), margin + 42, y + 14);
  
  const durationVal = sanitizeText(analysis.duration);
  doc.text(doc.splitTextToSize(durationVal, contentWidth - 45), margin + 42, y + 22);

  y += 36;

  // 1. SUMMARY SECTION
  checkPageOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "1. Synthèse Générale & Portée" : "1. General Summary & Scope", margin, y);
  
  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  // General summary text wrapping
  const summaryParagraphs = analysis.summary.split("\n").filter(p => p.trim().length > 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85); // slate-700
  
  for (const para of summaryParagraphs) {
    const wrappedText = doc.splitTextToSize(sanitizeText(para), contentWidth);
    const textHeight = wrappedText.length * 5;
    checkPageOverflow(textHeight + 5);
    doc.text(wrappedText, margin, y);
    y += textHeight + 4;
  }
  
  y += 4;

  // 2. RISKS SECTION
  checkPageOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "2. Clauses à Risques & Points de Vigilance" : "2. Risk Clauses & Points of Vigilance", margin, y);
  
  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  if (analysis.risks.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(lang === "fr" ? "Aucun risque ou point de vigilance n'a été détecté dans ce document." : "No risk or point of vigilance was detected in this document.", margin, y);
    y += 10;
  } else {
    for (const risk of analysis.risks) {
      // Determine colors based on level
      let levelText = "";
      let fillCol: [number, number, number] = [241, 245, 249]; // light gray default
      let textCol: [number, number, number] = [71, 85, 105];   // slate-600
      let borderCol: [number, number, number] = [203, 213, 225];

      if (risk.level === "high") {
        levelText = lang === "fr" ? "DANGER / ÉLEVÉ" : "HIGH RISK";
        fillCol = [254, 226, 226]; // light red
        textCol = [185, 28, 28];   // red-700
        borderCol = [252, 165, 165]; // red-300
      } else if (risk.level === "medium") {
        levelText = lang === "fr" ? "ATTENTION / MOYEN" : "MEDIUM RISK";
        fillCol = [254, 243, 199]; // light amber
        textCol = [180, 83, 9];    // amber-700
        borderCol = [253, 230, 138]; // amber-300
      } else {
        levelText = lang === "fr" ? "VIGILANCE / FAIBLE" : "LOW RISK";
        fillCol = [241, 245, 249]; // light gray
        textCol = [71, 85, 105];   // slate-600
        borderCol = [226, 232, 240];
      }

      // Title & badge height
      const riskTitleText = sanitizeText(risk.clause);
      const wrappedTitle = doc.splitTextToSize(riskTitleText, contentWidth - 45);
      const wrappedDesc = doc.splitTextToSize(lang === "fr" ? `Explication : ${sanitizeText(risk.description)}` : `Explanation: ${sanitizeText(risk.description)}`, contentWidth - 10);
      const wrappedRec = doc.splitTextToSize(lang === "fr" ? `Recommandation : ${sanitizeText(risk.recommendation)}` : `Recommendation: ${sanitizeText(risk.recommendation)}`, contentWidth - 10);
      
      const cardHeight = 8 + wrappedTitle.length * 5 + wrappedDesc.length * 4.5 + wrappedRec.length * 4.5 + 8;
      
      checkPageOverflow(cardHeight);

      // Draw background card outline
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

      // Draw level badge
      doc.setFillColor(fillCol[0], fillCol[1], fillCol[2]);
      doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
      doc.roundedRect(margin + 4, y + 4, 34, 6, 1, 1, "FD");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(textCol[0], textCol[1], textCol[2]);
      doc.text(levelText, margin + 21 - doc.getTextWidth(levelText) / 2, y + 8.2);

      // Draw risk title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(wrappedTitle, margin + 42, y + 8);

      let innerY = y + 8 + wrappedTitle.length * 5 + 2;

      // Draw description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(wrappedDesc, margin + 5, innerY);
      innerY += wrappedDesc.length * 4.5 + 1.5;

      // Draw recommendation
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(wrappedRec, margin + 5, innerY);

      y += cardHeight + 4;
    }
  }

  y += 4;

  // 3. OBLIGATIONS SECTION
  checkPageOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "3. Suivi des Obligations Contractuelles" : "3. Tracker of Contractual Obligations", margin, y);
  
  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  if (analysis.obligations.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(lang === "fr" ? "Aucune obligation d'action ou de livrable formel n'a été répertoriée." : "No formal action or deliverable obligation has been listed.", margin, y);
    y += 10;
  } else {
    for (const ob of analysis.obligations) {
      const obText = sanitizeText(ob.description);
      const wrappedOb = doc.splitTextToSize(obText, contentWidth - 10);
      const deadlineText = ob.deadline ? (lang === "fr" ? `Échéance : ${sanitizeText(ob.deadline)}` : `Deadline: ${sanitizeText(ob.deadline)}`) : "";
      
      const itemHeight = 6 + wrappedOb.length * 4.5 + (deadlineText ? 5 : 0) + 4;
      checkPageOverflow(itemHeight);

      // Draw light container box
      doc.setFillColor(252, 252, 253);
      doc.setDrawColor(241, 245, 249);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, "FD");

      // Bullet / party badge
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin + 4, y + 4, doc.getTextWidth(sanitizeText(ob.party).toUpperCase()) + 4, 5, 1, 1, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(sanitizeText(ob.party).toUpperCase(), margin + 6, y + 7.5);

      let textStartY = y + 7.5;
      if (doc.getTextWidth(sanitizeText(ob.party)) > 80) {
        textStartY += 6;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(wrappedOb, margin + 5, y + 13);

      if (deadlineText) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(deadlineText, margin + 5, y + 13 + wrappedOb.length * 4.5 + 2);
      }

      y += itemHeight + 3;
    }
  }

  y += 4;

  // 4. TERMINATION SECTION
  checkPageOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "4. Conditions de Résiliation & Rupture" : "4. Termination & Breach Conditions", margin, y);
  
  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  const tCond = analysis.termination;
  const tMechanism = doc.splitTextToSize(lang === "fr" ? `Mécanismes de déclenchement : ${sanitizeText(tCond.mechanism)}` : `Triggering mechanisms: ${sanitizeText(tCond.mechanism)}`, contentWidth - 10);
  const tNotice = doc.splitTextToSize(lang === "fr" ? `Délai de préavis applicable : ${sanitizeText(tCond.noticePeriod)}` : `Applicable notice period: ${sanitizeText(tCond.noticePeriod)}`, contentWidth - 10);
  const tPenalties = doc.splitTextToSize(lang === "fr" ? `Pénalités & Conséquences de rupture : ${sanitizeText(tCond.penalties)}` : `Breach consequences & penalties: ${sanitizeText(tCond.penalties)}`, contentWidth - 10);
  const tDetails = doc.splitTextToSize(lang === "fr" ? `Clauses additionnelles : ${sanitizeText(tCond.details)}` : `Additional clauses: ${sanitizeText(tCond.details)}`, contentWidth - 10);

  const tHeight = 10 + (tMechanism.length + tNotice.length + tPenalties.length + tDetails.length) * 4.5 + 16;
  checkPageOverflow(tHeight);

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, tHeight, 2, 2, "FD");

  let tY = y + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  doc.text(lang === "fr" ? "• MÉCANISMES :" : "• TRIGGER MECHANISMS:", margin + 5, tY);
  tY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(tMechanism, margin + 10, tY);
  tY += tMechanism.length * 4.5 + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "• PRÉAVIS :" : "• NOTICE PERIODS:", margin + 5, tY);
  tY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(tNotice, margin + 10, tY);
  tY += tNotice.length * 4.5 + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "• PÉNALITÉS ET RUPTURE :" : "• PENALTIES & BREACH CONSEQUENCES:", margin + 5, tY);
  tY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(tPenalties, margin + 10, tY);
  tY += tPenalties.length * 4.5 + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "• DÉTAILS ADDITIONNELS :" : "• ADDITIONAL CLAUSES:", margin + 5, tY);
  tY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(tDetails, margin + 10, tY);

  y += tHeight + 8;

  // 5. COMPLIANCE SECTION
  checkPageOverflow(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(lang === "fr" ? "5. Audit de Conformité Légale & Réglementaire" : "5. Legal & Regulatory Compliance Audit", margin, y);
  
  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  if (analysis.compliance.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(lang === "fr" ? "Aucune anomalie ou point de conformité n'a été spécifié." : "No compliance issues or specifics have been detailed.", margin, y);
    y += 10;
  } else {
    for (const comp of analysis.compliance) {
      let statusText = "";
      let fillCol: [number, number, number] = [241, 245, 249];
      let textCol: [number, number, number] = [71, 85, 105];
      let borderCol: [number, number, number] = [203, 213, 225];

      if (comp.status === "compliant") {
        statusText = lang === "fr" ? "CONFORME" : "COMPLIANT";
        fillCol = [209, 250, 229]; // light green
        textCol = [5, 150, 105];   // green-600
        borderCol = [110, 231, 183]; // green-300
      } else if (comp.status === "warning") {
        statusText = lang === "fr" ? "À SURVEILLER" : "WATCHLIST";
        fillCol = [254, 243, 199]; // light amber
        textCol = [180, 83, 9];    // amber-700
        borderCol = [253, 230, 138];
      } else {
        statusText = lang === "fr" ? "NON CONFORME" : "NON-COMPLIANT";
        fillCol = [254, 226, 226]; // light red
        textCol = [185, 28, 28];   // red-700
        borderCol = [252, 165, 165];
      }

      const subjectText = sanitizeText(comp.subject);
      const wrappedSubject = doc.splitTextToSize(subjectText, contentWidth - 45);
      const wrappedDetails = doc.splitTextToSize(lang === "fr" ? `Évaluation : ${sanitizeText(comp.details)}` : `Evaluation: ${sanitizeText(comp.details)}`, contentWidth - 10);
      const wrappedRemedy = comp.remedy ? doc.splitTextToSize(lang === "fr" ? `Action de remédiation : ${sanitizeText(comp.remedy)}` : `Remediation action: ${sanitizeText(comp.remedy)}`, contentWidth - 10) : [];
      
      const compHeight = 8 + Math.max(1, wrappedSubject.length) * 5 + wrappedDetails.length * 4.5 + (wrappedRemedy.length ? wrappedRemedy.length * 4.5 + 2 : 0) + 6;
      checkPageOverflow(compHeight);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, compHeight, 2, 2, "FD");

      // Draw status badge
      doc.setFillColor(fillCol[0], fillCol[1], fillCol[2]);
      doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
      doc.roundedRect(margin + 4, y + 4, 30, 5.5, 1, 1, "FD");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(textCol[0], textCol[1], textCol[2]);
      doc.text(statusText, margin + 19 - doc.getTextWidth(statusText) / 2, y + 7.8);

      // Draw subject title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(wrappedSubject, margin + 38, y + 8);

      let compInnerY = y + 8 + Math.max(1, wrappedSubject.length) * 5 + 1.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(wrappedDetails, margin + 5, compInnerY);
      compInnerY += wrappedDetails.length * 4.5 + 2;

      if (wrappedRemedy.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(180, 83, 9); // amber-700
        doc.text(wrappedRemedy, margin + 5, compInnerY);
      }

      y += compHeight + 4;
    }
  }

  // ----------------------------------------------------
  // SECOND PASS: ADD FOOTERS & PAGE NUMBERS
  // ----------------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Page header for pages > 1
    if (i > 1) {
      drawPageHeader();
    }
    
    // Bottom footer line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, 282, pageWidth - margin, 282);
    
    // Bottom footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    
    const footerText = lang === "fr" 
      ? `Thus Privacy L8 • Audit de haute précision • Généré le ${new Date().toLocaleDateString("fr-FR")}`
      : `Thus Privacy L8 • High-precision Audit Engine • Generated on ${new Date().toLocaleDateString()}`;
    doc.text(footerText, margin, 287);
    
    const pageNumText = lang === "fr" 
      ? `Page ${i} sur ${pageCount}` 
      : `Page ${i} of ${pageCount}`;
    doc.text(pageNumText, pageWidth - margin - doc.getTextWidth(pageNumText), 287);
  }

  // Save the PDF
  const sanitizedTitle = analysis.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40);
  doc.save(`audit_report_thusl8_${sanitizedTitle}.pdf`);
}
