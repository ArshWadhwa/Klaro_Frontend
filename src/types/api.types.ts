// General API types

export interface ApiError {
  error: string;
  timestamp: string;
  status: number;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
