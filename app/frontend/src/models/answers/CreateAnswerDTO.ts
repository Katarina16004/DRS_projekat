export interface CreateAnswerDTO {
  message: string;
  ID_Answer: number;
  ID_Question: number;
  Answer_Text: string;
  Is_Correct: boolean;
}