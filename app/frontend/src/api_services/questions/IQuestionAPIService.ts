import type { CreateQuestionDTO } from "../../models/questions/CreateQuestionDTO";
import type { QuestionAssignedDTO } from "../../models/questions/QuestionAssignedDTO";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";


export interface IQuestionAPIService{
    getNextQuestion(token: string, session_id:string):Promise<QuestionDTO>;
    assign_question_to_quiz(token:string, quiz_id:number, question_id:number):Promise<QuestionAssignedDTO>;
    remove_question_to_quiz(token:string, quiz_id:number, question_id:number):Promise<string>;
    createQuestion(token:string, text:string, points:number ,category:string ):Promise<CreateQuestionDTO>

}