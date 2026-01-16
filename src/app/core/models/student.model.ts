import { User } from './user.model';
import { Level } from './level.model';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level: Level;
  user: User;
  createdAt?: Date;
}
