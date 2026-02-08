import axios from "axios"
import type { AnswerResponseDTO } from "../../models/answers/AnswerResponseDTO"
import type { IAsnwerAPIService } from "./IAnswerAPIService"

const API_URL = `http://localhost:5000/`

export const questionApi: IAsnwerAPIService = {

    async sumbitAnswer(token: string, session_id: string, answerID: number): Promise<AnswerResponseDTO> {
        try {
            const res = await axios.post<AnswerResponseDTO>(
                `${API_URL}/quizzes/answer/${session_id}`,
                {
                    answer_id: answerID
                },
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
    }


}