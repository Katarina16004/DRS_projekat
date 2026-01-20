from flask import Blueprint, request, jsonify
from infrastructure.classes.Quiz import Quiz
from infrastructure.classes.QuestionQuiz import QuestionQuiz

quiz_router = Blueprint('quiz_router',__name__)

@quiz_router.route('/quizzes/all', methods=['GET'])
def get_all_quizzes():
    quizzes = Quiz.get_all()

    return jsonify([
        {
            "ID_Quiz": q.ID_Quiz,
            "Quiz_length": q.Quiz_length,
            "ID_User": q.ID_User,
        }
        for q in  quizzes
    ])

@quiz_router.route('/quizzes/random', methods=['GET'])
def get_all_quizzes():
    q = Quiz.get_random()

    return jsonify(
        {
            "ID_Quiz": q.ID_Quiz,
            "Quiz_length": q.Quiz_length,
            "ID_User": q.ID_User,
        }
    )


@quiz_router.route('/quizzes/<int:ID_Quiz>/length', methods=['GET'])
def get_quiz_length(quiz_id):
    length = Quiz.get_length(quiz_id)

    return jsonify({
        "ID_Quiz": quiz_id,
        "Quiz_length": length
    }), 200


@quiz_router.route('/quizzes/<int:ID_Quiz>/questions', methods=['GET'])
def get_quiz_questions(ID_Quiz):
    rows = QuestionQuiz.get_questions_for_quiz(ID_Quiz)

    if not rows:
        return jsonify({
            "ID_Quiz": ID_Quiz,
            "Questions": []
        }), 200

    question_ids = [row.ID_Question for row in rows]

    return jsonify({
        "ID_Quiz": ID_Quiz,
        "Questions": question_ids
    }), 200

@quiz_router.route('/quizzes/<int:ID_Author>', methods=['GET'])
def get_all_quizzes(ID_Author):
    quizzes = Quiz.get_all_from_author(ID_Author)

    if len(quizzes) == 0:
        return jsonify({"error": "Quiz not found"}), 404

    return jsonify([
        {
            "ID_Quiz": q.ID_Quiz,
            "Quiz_length": q.Quiz_length,
            "ID_User": q.ID_User,
        }
        for q in  quizzes
    ])



@quiz_router.route("/quizzes/add",methods=['PUT'])
def add_quiz():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        quiz = Quiz(**data)
        quiz.save()
        return jsonify({"message": "Quiz created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_router.route("/quizzes/<int:ID_Quiz>", methods=['PATCH'])
def update_quiz(ID_Quiz):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    quiz = Quiz.get_by_ID(ID_Quiz)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    quiz.update(**data)

    return jsonify({"message": "Quiz updated successfully"}), 200


@quiz_router.route("/quizzes/<int:ID_Quiz>", methods=['DELETE'])
def delete_quiz(ID_Quiz):
    quiz = Quiz.get_by_ID(ID_Quiz)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    quiz.delete()

    return jsonify({"message": "Quiz deleted successfully"}), 200
