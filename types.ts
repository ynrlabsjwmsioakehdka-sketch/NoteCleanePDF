export type AppState = 'idle' | 'extracting' | 'processing' | 'completed';

export interface ProcessedImage {
  id: number;
  original: string; // Base64 data URL
  cleaned: string;  // Base64 data URL
  status: 'pending' | 'success' | 'error';
}

export interface ProcessingStats {
  total: number;
  current: number;
  startTime: number;
}