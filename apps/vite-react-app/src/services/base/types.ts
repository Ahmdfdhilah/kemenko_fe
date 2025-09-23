
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  records: T[];
  offset: number;
  limit: number;
}