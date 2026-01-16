import type { UserDTO } from "../../models/users/UserDTO";

export interface IUserAPIService {
    getAllUsers(token: string): Promise<UserDTO[]>;
    deleteUser(token: string, id: number): Promise<void>;
    changeUserRole(token: string, id: number, role: string): Promise<UserDTO>;
    updateProfile(token: string, id: number, user: UserDTO): Promise<UserDTO>;
}