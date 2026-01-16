import { Student } from './student.model';
import { Teacher } from './teacher.model';

export enum InternshipStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Internship {
  id: number;
  title: string;
  company: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: InternshipStatus;
  student: Student;
  supervisor?: Teacher;
  createdAt?: Date;
  updatedAt?: Date;
}
