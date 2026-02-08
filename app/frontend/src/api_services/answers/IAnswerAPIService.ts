import type { AnswerResponseDTO } from "../../models/answers/AnswerResponseDTO";


export interface IAsnwerAPIService{
    sumbitAnswer(token : string,session_id:string, answerID : number):Promise<AnswerResponseDTO>
}