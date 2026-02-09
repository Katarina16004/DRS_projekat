from infrastructure.Database.database_connect import db

class Game(db.Model):
    __tablename__='Game'

    def __init__(self,ID_Player,Score,ID_Quiz):
        self.ID_Player=ID_Player
        self.Score=Score
        self.ID_Quiz=ID_Quiz

    ID_Game = db.Column(db.Integer,primary_key=True,autoincrement=True)
    ID_Player = db.Column(db.Integer,nullable=False)
    Score = db.Column(db.Integer,nullable=False)
    ID_Quiz = db.Column(db.Integer,db.ForeignKey('Quiz.ID_Quiz'),nullable=False)

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
    def get_by_id(cls,ID_Game):
        return cls.query.filter(cls.ID_Game == ID_Game).first()
    
    @classmethod
    def get_n_highest_scores(cls, n=10):
        return cls.query.order_by(cls.Score.desc()).limit(n).all()
    
    @classmethod
    def get_games_from_player(cls,ID_Player):
        return cls.query.filter(cls.ID_Player == ID_Player)
    
    @classmethod
    def create_game(cls, player_id, score, quiz_id):
        game = cls(ID_Player=player_id, Score=score, ID_Quiz=quiz_id)
        db.session.add(game)
        db.session.commit()
        return game
    
    @classmethod
    def get_games_by_quiz_id(cls, quiz_id):
        return cls.query.filter(cls.ID_Quiz == quiz_id).all()
