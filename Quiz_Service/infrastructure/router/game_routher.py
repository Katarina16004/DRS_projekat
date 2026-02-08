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

@game_router.route('/games/<int:ID_Game>/game', methods=['GET'])
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

@game_router.route("/games/<int:ID_Player>", methods=['GET'])
def get_games_from_player(ID_Player):
    games = Game.get_games_from_player(ID_Player)

    if len(games) == 0 or games is None:
        return jsonify({"error": "Player does not exist"}), 404
    
    return jsonify([
    {
        "ID_Game": g.ID_Game,
        "ID_Player": g.ID_Player,
        "Score": g.Score,
        "ID_Quiz": g.ID_Quiz
    }
    for g in games
    ])

@game_router.route("/games/highest/<int:n>", methods=['GET'])
def get_highest_scores(n):
    games = Game.get_n_highest_scores(n)

    return jsonify([
    {
        "ID_Game": g.ID_Game,
        "ID_Player": g.ID_Player,
        "Score": g.Score,
        "ID_Quiz": g.ID_Quiz
    }
    for g in games
    ])

@game_router.route("/games", methods=['POST'])
def add_game():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["ID_Player", "Score", "ID_Quiz"]

    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({
            "error": "Missing required fields",
            "missing": missing
        }), 400

    try:
        game = Game.create_game(
            player_id=data["ID_Player"],
            score=data["Score"],
            quiz_id=data["ID_Quiz"]
        )

        return jsonify({
            "message": "Game created successfully",
            "ID_Game": game.ID_Game,
            "ID_Player": game.ID_Player,
            "Score": game.Score,
            "ID_Quiz": game.ID_Quiz
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@game_router.route("/games/<int:ID_Game>", methods=['PATCH'])
def update_game(ID_Game):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    game = Game.get_by_id(ID_Game)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    game.update(**data)

    return jsonify({"message": "Game updated successfully"}), 200


@game_router.route("/games/<int:ID_Game>", methods=['DELETE'])
def delete_game(ID_Game):

    game = Game.get_by_id(ID_Game)

    if not game:
        return jsonify({"error": "Game not found"}), 404

    game.delete()

    return jsonify({"message": "Game deleted successfully"}), 200