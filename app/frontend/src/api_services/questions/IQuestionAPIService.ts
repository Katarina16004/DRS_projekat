import type { QuestionDTO } from "../../models/questions/QuestionDTO";


export interface IQuestionAPIService{
    getNextQuestion(token: string, session_id:string):Promise<QuestionDTO>;
}