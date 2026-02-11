
export interface AnswerResponseDTO {
  result: "correct" | "wrong";
  current_question_index: number;
  score: number;
  correct_count: number;
  wrong_count: number;
  user_id: number;
}
