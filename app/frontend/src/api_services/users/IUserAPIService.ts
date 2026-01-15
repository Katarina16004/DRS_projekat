import type { UserDTO } from "../../models/users/UserDTO";


export interface IUserAPIService {
    getAllUsers(token: string): Promise<UserDTO[]>
    deleteUser(token: string, id: number): Promise<UserDTO>
    //deleteAllUsers(token: string): Promise<void>      //mora i na back-u da se doda, za sada je pod komentarom
    changeUserRole(token: string, id: number, role: string): Promise<UserDTO>
    updateProfile(token: string, id: number, user: UserDTO): Promise<UserDTO>
}