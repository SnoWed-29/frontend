import { User } from './user.model';
import { Sector } from './sector.model';

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  sector: Sector;
  user: User;
  createdAt?: Date;
}
