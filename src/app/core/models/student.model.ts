import { User } from './user.model';
import { Level } from './level.model';
import { Sector } from './sector.model';

export interface Student {
  id: number;
  user: User;
  level: Level;
  sector?: Sector;
  academicYear: string;
  createdAt?: Date;
  updatedAt?: Date;
}
