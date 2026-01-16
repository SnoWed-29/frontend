import { Internship } from './internship.model';

export interface Report {
  id: number;
  title: string;
  content: string;
  submittedAt: Date;
  internship: Internship;
  feedback?: string;
  grade?: number;
  createdAt?: Date;
}
