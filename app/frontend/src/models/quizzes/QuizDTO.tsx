export interface QuizDTO {
    ID_Quiz: number
    Quiz_length: number
    ID_User: number
    Name: string
    Category: string
    Number_Of_Questions: number
    Is_Accepted: boolean
    Rejection_Reason?: string | null
}
