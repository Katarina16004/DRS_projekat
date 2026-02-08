import type { GameDTO } from "../../models/games/GameDTO";
import type { CreateQuizDTO } from "../../models/quizzes/CreateQuizDTO";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";


export interface IQuizService {
    getAllQuizzes(token: string): Promise<QuizDTO[]>
    getQuizById(token: string, id: number): Promise<QuizDTO>
    //getQuizByCategory(token: string, category: string): Promise<QuizDTO[]>       //ukoliko bude bilo neophodno
    addQuiz(token: string, quiz: QuizDTO): Promise<QuizDTO>
    deleteQuiz(token: string, id: number): Promise<QuizDTO>

    startQuiz(token: string, quiz_id : number ):Promise<CreateQuizDTO>;
    finishQuiz(token: string, session_id : string):Promise<GameDTO>;

    createQuiz(token: string, name :string, category :string , duration: number) :Promise<number>
    //acceptQuiz(token:string,ID_Quiz:number):Promise<string>
    //rejectQuiz(token:string,ID_Quiz:number):Promise<string>
    //getQuizByStatu(token: string, status: string): Promise<QuizDTO[]>             //filteri kod admina
}