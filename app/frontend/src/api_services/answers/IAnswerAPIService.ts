import type { AnswerResponseDTO } from "../../models/answers/AnswerResponseDTO";
import type { CreateAnswerDTO } from "../../models/answers/CreateAnswerDTO";


export interface IAsnwerAPIService{
    sumbitAnswer(token : string,session_id:string, answerID : number, userId: number):Promise<AnswerResponseDTO>
    createAnswer(token: string, question_id:number, answer_text : string, isCorrect : boolean):Promise<CreateAnswerDTO>
}