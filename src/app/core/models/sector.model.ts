import { Level } from './level.model';

export enum SectorName {
  DEV = 'DEV',
  DATA = 'DATA',
  SECURITY = 'SECURITY',
  GLOBAL_B1 = 'GLOBAL_B1',
  GLOBAL_B2 = 'GLOBAL_B2'
}

export interface Sector {
  id: number;
  name: string;
  level?: Level;
  createdAt?: Date;
  updatedAt?: Date;
}
