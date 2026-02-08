from __future__ import annotations
from redis_om import HashModel

QUIZ_SESSION_TTL = 30 * 60


class QuizSession(HashModel, index = True):
    user_id: int
    quiz_id: int
    current_question_index: int = 0
    score: int = 0
    correct_count: int = 0
    wrong_count: int = 0

    def save_with_ttl(self):
        super().save()
        self.expire(QUIZ_SESSION_TTL)

    @classmethod
    def create_session(cls, user_id: int, quiz_id: int) -> QuizSession:
        session = cls(
            user_id=user_id,
            quiz_id=quiz_id
        )
        session.save_with_ttl()
        return session

    @classmethod
    def get_session(cls, session_id: str) -> QuizSession | None:
        try:
            return cls.get(session_id)
        except KeyError:
            return None

    @classmethod
    def session_exists(cls, session_id: str) -> bool:
        return cls.db().exists(f"QuizSession:{session_id}") == 1

    @classmethod
    def delete_session_by_id(cls, session_id: str):
        cls.delete(session_id)

    def answer_correct(self):
        self.score += 1
        self.correct_count += 1
        self.current_question_index += 1
        self.save_with_ttl()

    def answer_wrong(self):
        self.wrong_count += 1
        self.current_question_index += 1
        self.save_with_ttl()
