//ENUM
export type Sort  = 'asc'  | 'desc'

//BASE
export interface Base {
  id: string;
  created_at: string;
  updated_at: string;
}

//RESPONSE
export interface PaginatedResponse<T> {
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }
  items: T[];
}