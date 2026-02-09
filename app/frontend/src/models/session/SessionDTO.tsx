export interface SessionDTO {
    user_id: number
    quiz_id: number
    current_question_index: number
    score: number
    correct_count: number
    wrong_count: number
}