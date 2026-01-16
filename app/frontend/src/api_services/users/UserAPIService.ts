import type { UserDTO } from "../../models/users/UserDTO";
import type { IUserAPIService } from "./IUserAPIService";
import axios from "axios"


const API_URL_ADMIN: string = `http://localhost:5000/admin`
const API_URL: string = `http://localhost:5000/`

export const userApi: IUserAPIService = {
    async getAllUsers(token: string): Promise<UserDTO[]> {
        try {
            const res = await axios.get<{ success: boolean, message: string, data: UserDTO[] }>(
                `${API_URL_ADMIN}/all_users`, { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data.data || []
        } catch (error) {
            console.error("Error while fetching all users: ", error)
            return []
        }
    },

    async deleteUser(token: string, id: number): Promise<UserDTO> {
        try {
            const res = await axios.delete<{ success: boolean, message: string, data: UserDTO }>(
                `${API_URL_ADMIN}/delete/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data.data
        } catch (error) {
            console.error(`Error while deleting user with ${id}: `, error)
            throw error
        }
    },

    async changeUserRole(token: string, id: number, role: string): Promise<UserDTO> {
        try {
            const res = await axios.patch<{ success: boolean, message: string, data: UserDTO }>(
                `${API_URL_ADMIN}/role/${id}`,
                { role },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data.data
        } catch (error) {
            console.error(`Error while changing the user role at id: ${id}: `, error)
            throw error
        }
    },

    async updateProfile(token: string, id: number, user: UserDTO): Promise<UserDTO> {
        try {
            const res = await axios.patch<{ success: boolean, message: string, data: UserDTO }>(
                `${API_URL}/update_profile/${id}`,
                user,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data.data
        } catch (error) {
            console.error(`Error while changing the user role at id: ${id}: `, error)
            throw error
        }
    }
}