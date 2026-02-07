from infrastructure.classes import QuestionQuiz
from infrastructure.Database.database_connect import db
from sqlalchemy import func


class Quiz(db.Model):
    __tablename__ = 'Quiz'

    ID_Quiz = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Quiz_length = db.Column(db.Integer, nullable=False, default=0)
    ID_User = db.Column(db.Integer, nullable=False)

    Is_Accepted = db.Column(db.Boolean, nullable=False, default=False)
    Rejection_Reason = db.Column(db.String(45), nullable=True)

    def __init__(self, Quiz_length, ID_User):
        self.Quiz_length = Quiz_length
        self.ID_User = ID_User
        self.Is_Accepted = False
        self.Rejection_Reason = None


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


    def accept(self):
        self.Is_Accepted = True
        self.Rejection_Reason = None
        db.session.commit()

    def reject(self, reason):
        self.Is_Accepted = False
        self.Rejection_Reason = reason
        db.session.commit()


    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_ID(cls, quiz_id):
        return cls.query.filter(cls.ID_Quiz == quiz_id).first()

    @classmethod
    def get_all_from_author(cls, author_id):
        return cls.query.filter(cls.ID_User == author_id).all()

    @classmethod
    def get_accepted(cls):
        return cls.query.filter(cls.Is_Accepted == True).all()

    @classmethod
    def get_pending(cls):
        return cls.query.filter(cls.Is_Accepted == False).all()

    @classmethod
    def get_random(cls):
        return cls.query.filter(cls.Is_Accepted == True).order_by(func.rand()).first()

    @classmethod
    def get_length(cls, quiz_id):
        return db.session.query(func.count(QuestionQuiz.ID_Question)).filter(QuestionQuiz.ID_Quiz == quiz_id).scalar()
