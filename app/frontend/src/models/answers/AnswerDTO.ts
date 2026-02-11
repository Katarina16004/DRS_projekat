export interface AnswerDTO {
  answer_id: number;
  answer_text: string;
  answer_is_correct: boolean    
  user_id?: number
}