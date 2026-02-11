import type { QuestionDTO } from "../questions/QuestionDTO";

export interface QuizQuestionsDTO {
  ID_Quiz: number;
  Questions: QuestionDTO[];
}