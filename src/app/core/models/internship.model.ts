import { Student } from './student.model';
import { Teacher } from './teacher.model';
import { Level } from './level.model';
import { Sector } from './sector.model';

export enum InternshipStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Internship {
  id: number;
  subject: string;
  description?: string;
  company: string;
  city: string;
  startDate: Date;
  endDate: Date;
  status: InternshipStatus;
  teacherComment?: string;
  student?: Student;
  teacher?: Teacher;
  level?: Level;
  sector?: Sector;
  studentId?: number;
  teacherId?: number;
  levelId?: number;
  sectorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
