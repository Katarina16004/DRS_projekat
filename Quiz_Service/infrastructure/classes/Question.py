from sqlalchemy import func
from infrastructure.Database.database_connect import db

class Question(db.Model):
    __tablename__='Question'

    def __init__(self,ID_Question,Question_Text,Question_Points,Question_Category):
        self.ID_Question = ID_Question
        self.Question_Text = Question_Text
        self.Question_Points = Question_Points
        self.Question_Category = Question_Category

    ID_Question = db.Column(db.Integer,primary_key=True)
    Question_Text = db.Column(db.String(250), nullable=False)
    Question_Points = db.Column(db.Integer, nullable=False)
    Question_Category = db.Column(db.String(250), nullable=True)

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
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_questions_from_category(cls, Question_Category):
        return cls.query.filter(cls.Question_Category == Question_Category).all()

    @classmethod
    def get_random_questions_from_category(cls, Question_Category, n=5):
        return (cls.query.filter(cls.Question_Category == Question_Category)
            .order_by(func.rand()).limit(n).all())

    @classmethod
    def get_question_by_ID(cls, ID_Question):
        return cls.query.filter(cls.ID_Question == ID_Question).all()
