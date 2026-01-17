import { Internship } from './internship.model';

export interface Report {
  id: number;
  internship: Internship;
  filePath: string;
  uploadedAt: Date;
  grade?: number;
  feedback?: string;
}
