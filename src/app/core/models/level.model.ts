export enum LevelName {
  BAC_1 = 'BAC_1',
  BAC_2 = 'BAC_2',
  BAC_3 = 'BAC_3',
  BAC_4 = 'BAC_4',
  BAC_5 = 'BAC_5'
}

export interface Level {
  id: number;
  name: LevelName;
  description?: string;
}
