import { User } from './user.model';
import { Sector } from './sector.model';

export interface Teacher {
  id: number;
  user: User;
  sectors: Sector[];
  createdAt?: Date;
  updatedAt?: Date;
}
