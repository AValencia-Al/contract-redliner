export interface OriginalFile {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export type ContractSuggestion = {
  id: string;
  sectionTitle?: string;
  original: string;
  suggestion: string;
  reason: string;
};

export interface Contract {
  _id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  aiSummary?: string;
  aiInsights?: string;
  originalFile?: OriginalFile;
  aiSuggestions?: ContractSuggestion[];
}
