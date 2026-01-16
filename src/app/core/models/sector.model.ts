export enum SectorName {
  INFORMATIQUE = 'INFORMATIQUE',
  MARKETING = 'MARKETING',
  DESIGN = 'DESIGN',
  BUSINESS = 'BUSINESS',
  COMMUNICATION = 'COMMUNICATION'
}

export interface Sector {
  id: number;
  name: SectorName;
  description?: string;
}
