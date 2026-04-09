// User related types

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  owner?: boolean;
}

export interface MemberInfo {
  id: number;
  fullName: string;
  email: string;
  owner: boolean;
}
