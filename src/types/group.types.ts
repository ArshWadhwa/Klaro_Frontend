// Group related types

import { MemberInfo } from './user.types';

export interface CreateGroupRequest {
  name: string;
  description?: string;
  memberEmails: string[]; // Changed from optional to required (can be empty array)
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  projectCount: number;
  inviteCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupDetails extends Group {
  members: MemberInfo[];
  inviteCode: string;
}

export interface GroupSummary {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  projectCount: number;
}

export interface AddMemberRequest {
  memberEmail: string;
}

export interface AddMembersRequest {
  memberEmails: string[];
}
