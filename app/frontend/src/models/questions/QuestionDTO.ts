import type { AnswerDTO } from "../answers/AnswerDTO";

export interface QuestionDTO {
  question_index?: number;
  question_id?: number;
  question_text?: string;
  question_points?: number;
  answers?: AnswerDTO[];

  // opcionalna polja u slucaju greske
  message?: string;   
  error?: string;     
}