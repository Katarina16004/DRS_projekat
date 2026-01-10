from infrastructure.Database.database_connect import db
from sqlalchemy import and_

class Answer(db.Model):
    __tablename__ = 'Answers'

    def __init__(self, ID_Question, ID_Answer, Answer_Text, Is_Correct):
        self.ID_Question = ID_Question
        self.ID_Answer = ID_Answer
        self.Answer_Text = Answer_Text
        self.Is_Correct = Is_Correct
        
    ID_Question = db.Column(db.Integer, primary_key=True)
    ID_Answer = db.Column(db.Integer, primary_key=True)
    Answer_Text = db.Column(db.String(45), nullable=False)
    Is_Correct = db.Column(db.Boolean, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_answer_by_id(cls, ID_Question, ID_Answer):
        return cls.query.filter(
            and_(cls.ID_Question == ID_Question, cls.ID_Answer == ID_Answer)
        ).first()

    @classmethod
    def get_answers_by_question(cls, ID_Question):
        return cls.query.filter(cls.ID_Question == ID_Question).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    @classmethod
    def get_answer_by_id(cls, ID_Question, ID_Answer):
        return cls.query.filter(and_(cls.ID_Question == ID_Question, cls.ID_Answer == ID_Answer)).first()