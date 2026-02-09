import axios from "axios"
import type { QuestionDTO } from "../../models/questions/QuestionDTO"
import { type IQuestionAPIService } from "./IQuestionAPIService"
import type { QuestionAssignedDTO } from "../../models/questions/QuestionAssignedDTO"

const API_URL = import.meta.env.SERVER

export const questionApi: IQuestionAPIService = {

    async getNextQuestion(token: string, session_id: string): Promise<QuestionDTO> {
        try {
            const res = await axios.post<QuestionDTO>(
                `${API_URL}questions/get_next/${session_id}`,
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
    async assign_question_to_quiz(token:string, quiz_id: number, question_id: number): Promise<QuestionAssignedDTO> {
        try {
            const res = await axios.post<QuestionAssignedDTO>(
                `${API_URL}quizzes/${quiz_id}/questions/${question_id}`,
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
    async remove_question_to_quiz(token:string,quiz_id: number, question_id: number): Promise<string> {
        try {
            const res = await axios.delete<string>(
                `${API_URL}quizzes/${quiz_id}/questions/${question_id}`,
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


}