import axios from "axios"
import type { AnswerResponseDTO } from "../../models/answers/AnswerResponseDTO"
import type { IAsnwerAPIService } from "./IAnswerAPIService"
import type { CreateAnswerDTO } from "../../models/answers/CreateAnswerDTO";

const API_URL = import.meta.env.VITE_SERVER;

export const answerApi: IAsnwerAPIService = {

    async sumbitAnswer(
        token: string,
        session_id: string,
        answerID: number
    ): Promise<AnswerResponseDTO> {

        const formData = new FormData();
        formData.append("ID_Answer", answerID.toString());

        const res = await axios.post<AnswerResponseDTO>(
            `${API_URL}quizzes/answer/${session_id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.data;
    }
    ,
    async createAnswer(token: string, question_id: number, answer_text: string, isCorrect: boolean): Promise<CreateAnswerDTO> {
        try {
            const formData = new FormData();
            formData.append("Answer_Text", answer_text);
            formData.append("Is_Correct", String(isCorrect));

            const res = await axios.post<CreateAnswerDTO>(
                `${API_URL}answer/${question_id}/answers`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return res.data;
        } catch (error) {
            console.error("Error while creating answer", error);
            throw error;
        }
    },

    async     editAnswer(token:string, answer_id:number,answer_text:string,isCorrect:boolean):Promise<CreateAnswerDTO>{
        try {
            const formData = new FormData();
            formData.append("Answer_Text", answer_text);
            formData.append("Is_Correct", String(isCorrect));

            const res = await axios.patch<CreateAnswerDTO>(
                `${API_URL}answers/${answer_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return res.data;
        } catch (error) {
            console.error("Error while creating answer", error);
            throw error;
        }
    }
}