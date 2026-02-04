from infrastructure.Database.database_connect import db


class QuestionQuiz(db.Model):
    __tablename__='QuestionQuiz'

    ID_Quiz = db.Column(db.Integer,db.ForeignKey('Quiz.ID_Quiz'),primary_key=True)
    ID_Question = db.Column(db.Integer,db.ForeignKey('Question.ID_Question'),primary_key=True)


    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    @classmethod
    def get_questions_for_quiz(cls,ID_Quiz):
        return cls.query.filter(cls.ID_Quiz == ID_Quiz).all()
    
    @classmethod
    def get_question_by_offset(cls, quiz_id: int, offset: int):
        return (
            cls.query
            .filter(cls.ID_Quiz == quiz_id)
            .order_by(cls.ID_Question)
            .offset(offset)
            .limit(1)
            .first()
        )

    @classmethod
    def get_quizzes_with_question(cls,ID_Question): 
        return cls.query.filter(cls.ID_Question == ID_Question).all()
