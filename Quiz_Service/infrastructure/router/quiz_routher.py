from flask import Blueprint, request, jsonify
from infrastructure.classes.Quiz import Quiz
from infrastructure.classes.QuestionQuiz import QuestionQuiz
from infrastructure.classes.QuizSession import QuizSession
from infrastructure.classes.Game import Game

quiz_router = Blueprint('quiz_router', __name__)


@quiz_router.route('/quizzes/all', methods=['GET'])
def get_all():
    quizzes = Quiz.get_all()

    return jsonify([
        {
            "ID_Quiz": q.ID_Quiz,
            "Name": q.Name,
            "Category": q.Category,
            "Quiz_length": q.Quiz_length,
            "ID_User": q.ID_User,
            "Is_Accepted": q.Is_Accepted,
            "Rejection_Reason": q.Rejection_Reason,
            "Number_of_Questions": len(QuestionQuiz.get_questions_for_quiz(q.ID_Quiz))
        }
        for q in quizzes
    ])


@quiz_router.route('/quizzes/random', methods=['GET'])
def get_random_quiz():
    q = Quiz.get_random()

    if not q:
        return jsonify({"error": "No accepted quizzes available"}), 404

    return jsonify({
        "ID_Quiz": q.ID_Quiz,
        "Name": q.Name,
        "Category": q.Category,
        "Quiz_length": q.Quiz_length,
        "ID_User": q.ID_User,
    })


@quiz_router.route('/quizzes/<int:quiz_id>/length', methods=['GET'])
def get_quiz_length(quiz_id):
    length = Quiz.get_length(quiz_id)

    return jsonify({
        "ID_Quiz": quiz_id,
        "Quiz_length": length
    }), 200


@quiz_router.route('/quizzes/<int:quiz_id>/questions', methods=['GET'])
def get_quiz_questions(quiz_id):
    rows = QuestionQuiz.get_questions_for_quiz(quiz_id)

    question_ids = [row.ID_Question for row in rows]

    return jsonify({
        "ID_Quiz": quiz_id,
        "Questions": question_ids
    }), 200


@quiz_router.route('/quizzes/author/<int:author_id>', methods=['GET'])
def get_all_quizzes(author_id):
    quizzes = Quiz.get_all_from_author(author_id)

    return jsonify([
        {
            "ID_Quiz": q.ID_Quiz,
            "Name": q.Name,
            "Category": q.Category,
            "Quiz_length": q.Quiz_length,
            "ID_User": q.ID_User,
            "Is_Accepted": q.Is_Accepted
        }
        for q in quizzes
    ])


@quiz_router.route('/quizzes/<int:quiz_id>/start', methods=['POST'])
def start_quiz(quiz_id):
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    session = QuizSession.create_session(user_id, quiz_id)

    return jsonify({
        "session_id": session.pk,
        "quiz_id": quiz_id
    }), 201


@quiz_router.route('/quizzes/get_session/<string:session_id>', methods=['GET'])
def get_session(session_id):
    session = QuizSession.get_session(session_id)

    if not session:
        return jsonify({"error": "Session not found or expired"}), 404

    return jsonify({
        "session_id": session.pk,
        "user_id": session.user_id,
        "quiz_id": session.quiz_id,
        "current_question_index": session.current_question_index,
        "score": session.score,
        "correct_count": session.correct_count,
        "wrong_count": session.wrong_count
    })


@quiz_router.route('/quizzes/<string:session_id>/finish', methods=['POST'])
def finish_quiz(session_id):
    data = request.json
    user_id = data.get("user_id")

    session = QuizSession.get_session(session_id)

    if not session:
        return jsonify({"error": "Session expired"}), 404

    if session.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    game = Game.create_game(player_id=user_id, score=session.score, quiz_id=session.quiz_id)

    QuizSession.delete_session_by_id(session_id)

    return jsonify({
        "ID_Player": game.ID_Player,
        "Score": game.Score,
        "ID_Quiz": game.ID_Quiz,
        "ID_Game": game.ID_Game
    }), 200


@quiz_router.route("/quizzes", methods=['POST'])
def add_quiz():
    data = request.get_json()

    required_fields = ["Name", "Category", "Quiz_length", "ID_User"]
    missing = [f for f in required_fields if f not in data]

    if missing:
        return jsonify({"missing": missing}), 400

    quiz = Quiz(
        Name=data["Name"],
        Category=data["Category"],
        Quiz_length=data["Quiz_length"],
        ID_User=data["ID_User"]
    )
    quiz.save()

    return jsonify({
        "ID_Quiz": quiz.ID_Quiz
    }), 201


@quiz_router.route("/quizzes/<int:quiz_id>", methods=['PATCH'])
def update_quiz(quiz_id):
    quiz = Quiz.get_by_ID(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    data = request.get_json() or {}

    allowed = {"Name", "Category", "Quiz_length"}
    filtered = {k: v for k, v in data.items() if k in allowed}

    quiz.update(**filtered)

    return jsonify({"message": "Quiz updated"})


@quiz_router.route("/quizzes/<int:quiz_id>", methods=['DELETE'])
def delete_quiz(quiz_id):
    quiz = Quiz.get_by_ID(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    quiz.delete()
    return jsonify({"message": "Quiz deleted"})


@quiz_router.route("/quizzes/<int:quiz_id>", methods=['GET'])
def get_quiz_by_id(quiz_id):
    quiz = Quiz.get_by_ID(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    questions = QuestionQuiz.get_questions_for_quiz(quiz_id)
    question_ids = [q.ID_Question for q in questions]

    return jsonify({
        "ID_Quiz": quiz.ID_Quiz,
        "Name": quiz.Name,
        "Category": quiz.Category,
        "ID_User": quiz.ID_User,
        "Quiz_length": quiz.Quiz_length,
        "Is_Accepted": quiz.Is_Accepted,
        "Rejection_Reason": quiz.Rejection_Reason,
        "Number_of_Questions": len(question_ids),
        "Questions": question_ids,
    })


@quiz_router.route("/quizzes/<int:quiz_id>/accept", methods=['POST'])
def accept_quiz(quiz_id):
    quiz = Quiz.get_by_ID(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    quiz.accept()
    return jsonify({"message": "Quiz accepted"})


@quiz_router.route("/quizzes/<int:quiz_id>/reject", methods=['POST'])
def reject_quiz(quiz_id):
    quiz = Quiz.get_by_ID(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    data = request.get_json()
    reason = data.get("reason")

    if not reason:
        return jsonify({"error": "Rejection reason is required"}), 400

    quiz.reject(reason)
    return jsonify({"message": "Quiz rejected"})
