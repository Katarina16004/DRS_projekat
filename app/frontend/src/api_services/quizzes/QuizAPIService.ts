import axios from "axios";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { IQuizService } from "./IQuizAPIService";

const API_URL = `http://localhost:5000/`

export const quizApi: IQuizService = {
    async getAllQuizzes(token: string): Promise<QuizDTO[]> {
        try {
            const res = await axios.get<{ success: boolean, message: string, data: QuizDTO[] }>(
                `${API_URL}quizzes/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return res.data.data || [];
        } catch (error) {
            console.error("Error while fetching all quizzes: ", error);
            return [];
        }
    },

    async getQuizById(token: string, id: number): Promise<QuizDTO> {
        try {
            const res = await axios.get<{ success: boolean, message: string, data: QuizDTO }>(
                `${API_URL}quiz/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return res.data.data
        } catch (error) {
            console.error(`Error fetching the quiz with that ${id}: `, error)
            throw error
        }
    },

    async addQuiz(token: string, quiz: QuizDTO): Promise<QuizDTO> {
        try {
            const res = await axios.post<{ success: boolean, message: string, data: QuizDTO }>(
                `${API_URL}add`,
                quiz,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data.data
        } catch (error) {
            console.error("Error creating a new quiz: ", error)
            throw error
        }
    },

    async deleteQuiz(token: string, id: number): Promise<QuizDTO> {
        try {
            const res = await axios.delete<{ success: boolean, message: string, data: QuizDTO }>(
                `${API_URL}delete/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data.data
        } catch (error) {
            console.error(`Error deleting the quiz with given id: ${id}: `, error)
            throw error
        }
    }
}