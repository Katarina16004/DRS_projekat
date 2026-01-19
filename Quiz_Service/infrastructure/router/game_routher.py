from flask import Blueprint, request, jsonify
from infrastructure.classes.Game import Game

game_router = Blueprint('game_router',__name__)

@game_router.route('/games/all', methods=['GET'])
def get_all_games():
    games = Game.get_all()

    return jsonify([
        {
            "ID_Game": g.ID_Game,
            "ID_Player": g.ID_Player,
            "Score": g.Score,
            "ID_Quiz": g.ID_Quiz
        }
        for g in games
    ])

@game_router.route('/games/<int:ID_Game>', methods=['GET'])
def get_game_by_ID(ID_Game):

    g = Game.get_by_id(ID_Game)

    if not g:
        return jsonify({"error": "Game not found"}), 404

    return jsonify({
            "ID_Game": g.ID_Game,
            "ID_Player": g.ID_Player,
            "Score": g.Score,
            "ID_Quiz": g.ID_Quiz
    })