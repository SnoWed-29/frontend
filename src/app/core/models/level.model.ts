export enum LevelName {
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  M1 = 'M1',
  M2 = 'M2'
}

export interface Level {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
