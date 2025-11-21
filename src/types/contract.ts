export interface OriginalFile {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface Contract {
  _id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  aiSummary?: string;
  aiInsights?: string;
  originalFile?: OriginalFile; 
}
