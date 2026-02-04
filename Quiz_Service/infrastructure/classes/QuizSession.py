from redis_om import HashModel

QUIZ_SESSION_TTL = 30 * 60


class QuizSession(HashModel):
    user_id: int
    quiz_id: int
    current_question_index: int = 0
    score: int = 0
    correct_count: int = 0
    wrong_count: int = 0

    def save_with_ttl(self):
        super().save()
        self.expire(QUIZ_SESSION_TTL)


    def create_session(user_id: int, quiz_id: int) -> QuizSession:
        session = QuizSession(
            user_id=user_id,
            quiz_id=quiz_id
        )
        session.save_with_ttl()
        return session

    def get_session(session_id: str) -> QuizSession | None:
        try:
            return QuizSession.get(session_id)
        except KeyError:
            return None
        
    def session_exists(session_id: str) -> bool:
        return QuizSession.db().exists(f"QuizSession:{session_id}") == 1

    def answer_correct(session: QuizSession):
        session.score += 1
        session.correct_count += 1
        session.current_question_index += 1
        session.save_with_ttl()

    def answer_wrong(session: QuizSession):
        session.wrong_count += 1
        session.current_question_index += 1
        session.save_with_ttl()

    def delete_session_by_id(session_id: str):
        QuizSession.delete(session_id)
