export interface RiskClause {
  id: string;
  clause: string;
  level: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export interface Obligation {
  id: string;
  party: string;
  description: string;
  deadline: string;
}

export interface TerminationCondition {
  mechanism: string;
  noticePeriod: string;
  penalties: string;
  details: string;
}

export interface ComplianceIssue {
  id: string;
  subject: string;
  status: "compliant" | "warning" | "non-compliant";
  details: string;
  remedy: string;
}

export interface ContractAnalysis {
  title: string;
  parties: string[];
  duration: string;
  summary: string;
  risks: RiskClause[];
  obligations: Obligation[];
  termination: TerminationCondition;
  compliance: ComplianceIssue[];
  fileName: string;
  fileSize: string;
  fileType: string;
}

export interface TranslationResponse {
  translatedText: string;
  language: string;
}
