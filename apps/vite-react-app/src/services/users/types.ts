// fe\apps\vite-react-app\src\services\users\types.ts
import { Base, PaginatedResponse, Sort } from "@/services/base";

//ENUM 
export type UserRole = 'admin' | 'user';

//BASE
export interface UserBase extends Base {
    name: string;
    email: string;
    role: UserRole;
}


//RESPONSE
export interface UserResponsePaginated extends PaginatedResponse<UserBase> { }

//REQUEST
export interface UserCreate {
    password: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface UserUpdate {
    name?: string;
    email?: string;
    role?: UserRole;
    password?: string  | null;
}

// QUERY
export interface UserPaginatedParams {
    page: number;
    limit: number;
    search?: string | null;
    role?: UserRole | null;
    sort_by?: 'name' | 'email' | 'role' | 'created_at' | null;
    sort_type?: Sort | null;
}