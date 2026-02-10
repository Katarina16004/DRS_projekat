from __future__ import annotations
from dataclasses import Field
from infrastructure.Database.database_connect import redis
from typing import Optional
import uuid

QUIZ_SESSION_TTL = 30 * 60

class QuizSession:
    def __init__(
        self,
        session_id: str,
        user_id: int,
        quiz_id: int,
        current_question_index: int = 0,
        score: int = 0,
        correct_count: int = 0,
        wrong_count: int = 0,
    ):
        self.session_id = session_id
        self.user_id = user_id
        self.quiz_id = quiz_id
        self.current_question_index = current_question_index
        self.score = score
        self.correct_count = correct_count
        self.wrong_count = wrong_count

    @staticmethod
    def _key(session_id: str) -> str:
        return f"quiz:session:{session_id}"

    def save_with_ttl(self):
        key = self._key(self.session_id)

        redis.hset(key, mapping={
            "session_id": self.session_id,
            "user_id": self.user_id,
            "quiz_id": self.quiz_id,
            "current_question_index": self.current_question_index,
            "score": self.score,
            "correct_count": self.correct_count,
            "wrong_count": self.wrong_count,
        })

        redis.expire(key, QUIZ_SESSION_TTL)

    @classmethod
    def create_session(cls, user_id: int, quiz_id: int) -> "QuizSession":
        session = cls(
            session_id=str(uuid.uuid4()),
            user_id=user_id,
            quiz_id=quiz_id
        )
        session.save_with_ttl()
        return session

    @classmethod
    def get_session(cls, session_id: str) -> Optional["QuizSession"]:
        key = cls._key(session_id)
        
        print("GET SESSION ID:", session_id)
        print("REDIS KEY:", key)
        print("EXISTS IN REDIS:", redis.exists(key))
        
        data = redis.hgetall(key)

        if not data:
            return None

        return cls(
            session_id=data["session_id"],
            user_id=int(data["user_id"]),
            quiz_id=int(data["quiz_id"]),
            current_question_index=int(data["current_question_index"]),
            score=int(data["score"]),
            correct_count=int(data["correct_count"]),
            wrong_count=int(data["wrong_count"]),
        )

    @classmethod
    def delete_session_by_id(cls, session_id: str):
        redis.delete(cls._key(session_id))

    def answer_correct(self):
        self.score += 1
        self.correct_count += 1
        self.current_question_index += 1
        self.save_with_ttl()

    def answer_wrong(self):
        self.wrong_count += 1
        self.current_question_index += 1
        self.save_with_ttl()