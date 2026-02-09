export interface CreateQuestionDTO {
  message: string;
  ID_Question: number;
  Question_Text: string;
  Question_Points: number;
  Question_Category?: string;
}
