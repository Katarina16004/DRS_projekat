import axios from "axios"
import type { QuestionDTO } from "../../models/questions/QuestionDTO"
import {type IQuestionAPIService} from "./IQuestionAPIService"

const API_URL = `http://localhost:5000/`

export const questionApi: IQuestionAPIService = {

    async getNextQuestion(token: string, session_id:string):Promise<QuestionDTO>{
        try {
            const res = await axios.post<QuestionDTO>(
                `${API_URL}/questions/get_next/${session_id}`,
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
    }


}