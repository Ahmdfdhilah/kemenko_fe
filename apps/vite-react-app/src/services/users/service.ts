// fe\apps\vite-react-app\src\services\users\service.ts
import { BaseService } from "../base";
import { UserBase, UserCreate, UserPaginatedParams, UserResponsePaginated, UserUpdate } from "./types";

export class UserService extends BaseService {
    constructor() {
        super('/users')
    }

    async userCreate(data: UserCreate): Promise<{ message: string }> {
        return this.post<{ message: string }>('', data);
    }

    async userUpdate(data: UserUpdate, id: string): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/${id}`, data)
    }

    async userDelete(id: string): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/${id}`)
    }

    async userGetAll(params: UserPaginatedParams): Promise<UserResponsePaginated> {
        return this.get<UserResponsePaginated>(`${this.buildQuery(params)}`)
    }

    async userGetById(id: string): Promise<UserBase> {
        return this.get<UserBase>(`/${id}`)
    }

}

export const userService = new UserService()