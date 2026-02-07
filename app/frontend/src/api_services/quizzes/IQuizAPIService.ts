import type { QuizDTO } from "../../models/quizzes/QuizDTO";


export interface IQuizService {
    getAllQuizzes(token: string): Promise<QuizDTO[]>
    getQuizById(token: string, id: number): Promise<QuizDTO>
    //getQuizByCategory(token: string, category: string): Promise<QuizDTO[]>       //ukoliko bude bilo neophodno
    addQuiz(token: string, quiz: QuizDTO): Promise<QuizDTO>
    deleteQuiz(token: string, id: number): Promise<QuizDTO>
    //getQuizByStatu(token: string, status: string): Promise<QuizDTO[]>             //filteri kod admina
}