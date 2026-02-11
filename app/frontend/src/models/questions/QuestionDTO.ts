import type { AnswerDTO } from "../answers/AnswerDTO";

export interface QuestionDTO {
  ID_Question: number;
  Question_Text: string;
  Question_Points: number;
  Answers: AnswerDTO[];

  // opcionalna polja u slucaju greske
  Message?: string;   
  Error?: string;     
}