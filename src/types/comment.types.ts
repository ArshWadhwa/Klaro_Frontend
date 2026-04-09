// Comment related types

export interface CreateCommentRequest {
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  authorId?: number;
  createdAt: string;
  updatedAt?: string;
}
