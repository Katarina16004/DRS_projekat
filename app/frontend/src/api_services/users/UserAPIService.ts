import type { UserDTO } from "../../models/users/UserDTO";
import axios from "axios";

const API_URL = `http://localhost:5000/`;

export const userApi = {
    async getAllUsers(token: string): Promise<UserDTO[]> {
        try {
            const res = await axios.get<UserDTO[]>(
                `${API_URL}all_users`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error("Error while fetching all users: ", error);
            return [];
        }
    },

    async deleteUser(token: string, id: number): Promise<void> {
        try {
            await axios.delete(
                `${API_URL}delete/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error(`Error while deleting user with id ${id}: `, error);
            throw error;
        }
    },

    async changeUserRole(token: string, id: number, role: string): Promise<UserDTO> {
        try {
            const formData = new FormData();
            formData.append("role", role);
            const res = await axios.put<UserDTO>(
                `${API_URL}role/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error(`Error while changing user role at id: ${id}: `, error);
            throw error;
        }
    },

    async updateProfile(token: string, id: number, user: UserDTO): Promise<UserDTO> {
        try {
            const res = await axios.put<UserDTO>(
                `${API_URL}update_profile`,
                user,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error(`Error while updating the user profile at id: ${id}: `, error);
            throw error;
        }
    }
};  