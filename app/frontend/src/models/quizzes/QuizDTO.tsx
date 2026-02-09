export interface QuizDTO {
    ID_Quiz: number
    Quiz_length: number
    ID_User: number
    Name: string
    Category: string
    Is_Accepted: number
    Rejection_Reason?: string | null
}
