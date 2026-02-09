from __future__ import annotations
from redis_om import HashModel
from typing import Optional
import uuid

QUIZ_SESSION_TTL = 30 * 60


class QuizSession(HashModel):
    user_id: int
    quiz_id: int
    current_question_index: int = 0
    score: int = 0
    correct_count: int = 0
    wrong_count: int = 0

    class Meta:
        global_key_prefix = "quiz"
        model_key_prefix = "session"

    def save_with_ttl(self):
        super().save()
        self.expire(QUIZ_SESSION_TTL)

    @classmethod
    def create_session(cls, user_id: int, quiz_id: int) -> "QuizSession":
        session = cls(
            user_id=user_id,
            quiz_id=quiz_id
        )
        session.save_with_ttl()
        return session

    @classmethod
    def get_session(cls, session_id: str) -> Optional["QuizSession"]:
        return cls.get(session_id)

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
