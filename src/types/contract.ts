export type Severity = "low" | "medium" | "high";

export interface Clause {
  id: string;
  title: string;
  body: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  primaryActionLabel?: string;
}
