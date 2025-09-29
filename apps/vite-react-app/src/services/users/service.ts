// fe\apps\vite-react-app\src\services\users\service.ts
import { BaseService } from "../base";
import { UserBase, UserCreate, UserPaginatedParams, UserResponsePaginated, UserUpdate } from "./types";

export class UserService extends BaseService {
    constructor() {
        super('/users')
    }

    async userCreate(data: UserCreate): Promise<string> {
        return this.post<string>('/', data);
    }

    async userUpdate(data: UserUpdate, id: string): Promise<string> {
        return this.put<string>(`/${id}`, data)
    }

    async userDelete(id: string): Promise<string> {
        return this.delete<string>(`/${id}`)
    }

    async userGetAll(params: UserPaginatedParams): Promise<UserResponsePaginated> {
        return this.get<UserResponsePaginated>(`/${this.buildQuery(params)}`)
    }

    async userGetById(id: string): Promise<UserBase> {
        return this.get<UserBase>(`/${id}`)
    }

}

export const userService = new UserService()