import type { GameDTO } from "../../models/games/GameDTO";
import type { CreateQuizDTO } from "../../models/quizzes/CreateQuizDTO";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { QuizQuestionsDTO } from "../../models/quizzes/QuizQuestionDTO";
import type { SessionDTO } from "../../models/session/SessionDTO";


export interface IQuizService {
    getAllQuizzes(token: string): Promise<QuizDTO[]>
    getQuizById(token: string, id: number): Promise<QuizDTO>
    //getQuizByCategory(token: string, category: string): Promise<QuizDTO[]>       //ukoliko bude bilo neophodno
    addQuiz(token: string, quiz: QuizDTO): Promise<QuizDTO>
    deleteQuiz(token: string, id: number): Promise<QuizDTO>

    startQuiz(token: string, quiz_id: number): Promise<CreateQuizDTO>;
    finishQuiz(token: string, session_id: string): Promise<GameDTO>;
    getSession(token: string, session_id: string): Promise<SessionDTO>;

    createQuiz(token: string, name: string, category: string, duration: number): Promise<number>
    acceptQuiz(token: string, ID_Quiz: number): Promise<string>
    rejectQuiz(token: string, ID_Quiz: number, reason: string): Promise<string>
    getAllPendingQuiz(token: string): Promise<QuizDTO[]>

    getQuizzesByAuthor(token: string, author_id: number): Promise<QuizDTO[]>
    getQuestionFromQuiz(token: string, ID_Quiz: number): Promise<QuizQuestionsDTO>
    getQuizByStatus(token: string, status: number): Promise<QuizDTO[]>             //filteri kod admina
}