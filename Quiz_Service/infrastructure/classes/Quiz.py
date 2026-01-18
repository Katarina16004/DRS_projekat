from infrastructure.Database.database_connect import db

class Quiz(db.Model):
    __tablename__='Quiz'
    def __init__(self,ID_Quiz,Quiz_length,ID_User):
        self.ID_Quiz = ID_Quiz
        self.Quiz_length = Quiz_length  #u sekundama!
        self.ID_User = ID_User
        
    ID_Quiz = db.column(db.Integer,primary_key=True)
    Quiz_length = db.Column(db.Integer, nullable=False)
    ID_User = db.Column(db.Integer, nullable=False)