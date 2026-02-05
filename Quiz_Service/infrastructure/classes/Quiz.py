from infrastructure.classes import QuestionQuiz
from infrastructure.Database.database_connect import db
from sqlalchemy import func

class Quiz(db.Model):
    __tablename__='Quiz'
    def __init__(self,ID_Quiz,Quiz_length,ID_User):
        self.ID_Quiz = ID_Quiz
        self.Quiz_length = Quiz_length  #u broju pitanja!
        self.ID_User = ID_User
        
    ID_Quiz = db.Column(db.Integer,primary_key=True)
    Quiz_length = db.Column(db.Integer, nullable=False,default = 0)
    ID_User = db.Column(db.Integer, nullable=False)

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
    def get_by_ID(cls,id):
        return cls.query.filter(cls.ID_Quiz == id).all()
    
    @classmethod
    def get_all_from_author(cls,author_id):
        return cls.query.filter(cls.ID_User == author_id).all()
    
    @classmethod
    def get_random(cls):
        return cls.query.order_by(func.rand()).first()
    
    @classmethod
    def get_length(cls, quiz_id):
        return db.session.query(
            func.count(QuestionQuiz.ID_Question)
        ).filter(
            QuestionQuiz.ID_Quiz == quiz_id
        ).scalar()