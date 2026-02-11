import axios from "axios";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { IQuizService } from "./IQuizAPIService";
import type { CreateQuizDTO } from "../../models/quizzes/CreateQuizDTO";
import type { GameDTO } from "../../models/games/GameDTO";
import type { SessionDTO } from "../../models/session/SessionDTO";
import type { QuizQuestionsDTO } from "../../models/quizzes/QuizQuestionDTO";

const API_URL = import.meta.env.VITE_SERVER;

export const quizApi: IQuizService = {
    async getAllQuizzes(token: string): Promise<QuizDTO[]> {
        try {
            const res = await axios.get<QuizDTO[]>(
                `${API_URL}quizzes/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return res.data || [];
        } catch (error) {
            console.error("Error while fetching all quizzes: ", error);
            return [];
        }
    },

    async getQuizById(token: string, id: number): Promise<QuizDTO> {
        try {
            const res = await axios.get<QuizDTO>(
                `${API_URL}quizzes/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return res.data
        } catch (error) {
            console.error(`Error fetching the quiz with that ${id}: `, error)
            throw error
        }
    },

    async addQuiz(token: string, quiz: QuizDTO): Promise<QuizDTO> {
        try {
            const res = await axios.post<QuizDTO>(
                `${API_URL}add`,
                quiz,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data
        } catch (error) {
            console.error("Error creating a new quiz: ", error)
            throw error
        }
    },

    async deleteQuiz(token: string, id: number): Promise<QuizDTO> {
        try {
            const res = await axios.delete<QuizDTO>(
                `${API_URL}delete/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data
        } catch (error) {
            console.error(`Error deleting the quiz with given id: ${id}: `, error)
            throw error
        }
    },

    async startQuiz(token: string, quiz_id: number): Promise<CreateQuizDTO> {
        try {
            const res = await axios.post<CreateQuizDTO>(
                `${API_URL}quizzes/${quiz_id}/start`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            return res.data
        }
        catch (error) {
            console.error("Error while trying to start Quiz", error)
            throw error
        }
    },


    async finishQuiz(token: string, session_id: string): Promise<GameDTO> {
        try {
            const res = await axios.post<GameDTO>(
                `${API_URL}quizzes/${session_id}/finish`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    },

    async getSession(token: string, session_id: string): Promise<SessionDTO> {
        try {
            const res = await axios.get<SessionDTO>(
                `${API_URL}quizzes/get_session/${session_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    },

    async createQuiz(token: string, name: string, category: string, duration: number): Promise<number> {
        try {
            const res = await axios.post<number>(
                `${API_URL}quizzes`,
                {
                    Quiz_length: duration,
                    Name: name,
                    Category: category
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            return res.data
        }
        catch (error) {
            console.error("Error while creating Quiz", error)
            throw error
        }
    },
    async acceptQuiz(token: string, ID_Quiz: number): Promise<string> {
        try {
            const res = await axios.post<string>(
                `${API_URL}quizzes/${ID_Quiz}}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            return res.data
        }
        catch (error) {
            console.error("Error while creating Quiz", error)
            throw error
        }
    },
    async rejectQuiz(token: string, ID_Quiz: number, reason: string): Promise<string> {
        try {
            const res = await axios.post<string>(
                `${API_URL}quizzes/${ID_Quiz}}/reject`,
                {
                    reason: reason
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            return res.data
        }
        catch (error) {
            console.error("Error while creating Quiz", error)
            throw error
        }
    },

    async getAllPendingQuiz(token: string): Promise<QuizDTO[]> {
        try {
            const res = await axios.get<QuizDTO[]>(
                `${API_URL}quizzes/pending`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return res.data || [];
        } catch (error) {
            console.error("Error while fetching all quizzes: ", error);
            return [];
        }
    },

    async getQuizzesByAuthor(token: string, authorId: number): Promise<QuizDTO[]> {
        try {
            const res = await axios.get<QuizDTO[]>(
                `${API_URL}quizzes/author/${authorId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data
        } catch (error) {
            console.log("Error fetching quizzez for moderator with that id: ", error)
            return []
        }
    },
    async getQuestionFromQuiz(token: string, ID_Quiz: number): Promise<QuizQuestionsDTO> {
        try {
            const res = await axios.get<QuizQuestionsDTO>(
                `${API_URL}quizzes/${ID_Quiz}/questions`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data
        } catch (error) {
            console.log("Error fetching quizzez for moderator with that id: ", error)
            throw error
        }
    },
    async getQuizByStatus(token: string, status: string): Promise<QuizDTO[]>{
                try {
            const res = await axios.get<QuizDTO[]>(
                `${API_URL}quizzes/statuses/${status}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            return res.data
        } catch (error) {
            console.log("Error fetching quizzez for moderator with that id: ", error)
            throw error
        }
    }
}