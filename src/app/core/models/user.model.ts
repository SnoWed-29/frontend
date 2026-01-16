export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
}
