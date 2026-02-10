from flask import Blueprint, request, jsonify
from infrastructure.classes.Answer import Answer
from infrastructure.classes.QuizSession import QuizSession

answer_router = Blueprint('answer_router',__name__)

@answer_router.route('/answers', methods=['GET'])
def get_all_answers():
    answers = Answer.get_all()

    return jsonify([
        {
            "ID_Question": a.ID_Question,
            "ID_Answer": a.ID_Answer,
            "Answer_Text": a.Answer_Text
        }
        for a in answers
    ])

@answer_router.route('/answer/<int:question_id>/answers', methods=['GET'])
def get_answers_from_question(question_id):
    answers = Answer.get_answers_by_question(question_id)

    return jsonify([
        {
            "ID_Question": a.ID_Question,
            "ID_Answer": a.ID_Answer,
            "Answer_Text": a.Answer_Text
        }
        for a in answers
    ])


@answer_router.route('/quizzes/answer/<string:session_id>', methods=['POST'])
def submit_answer(session_id):

    data = request.json
    answer_id = data.get("ID_Answer")
    user_id = data.get("user_id")

    session = QuizSession.get_session(session_id)
    if not session:
        return jsonify({"error": "Session expired"}), 404

    if session.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    answer = Answer.get_answer_by_id(answer_id)
    if not answer:
        return jsonify({"error": "Answer not found"}), 404

    if answer.Is_Correct:
        QuizSession.answer_correct(session)
        result = "correct"
    else:
        QuizSession.answer_wrong(session)
        result = "wrong"

    return jsonify({
        "result": result,
        "current_question_index": session.current_question_index,
        "score": session.score,
        "correct_count": session.correct_count,
        "wrong_count": session.wrong_count
    }), 200


@answer_router.route('/answer/selected_questions', methods=['POST'])
def get_answers_for_selected_questions():
    data = request.get_json()

    question_ids = data.get("question_ids", [])

    if not question_ids:
        return jsonify({"error": "No question IDs provided"}), 400

    all_answers = []

    for q_id in question_ids:
        answers = Answer.get_answers_by_question(q_id)
        all_answers.extend(answers)

    return jsonify([
        {
            "ID_Question": a.ID_Question,
            "ID_Answer": a.ID_Answer,
            "Answer_Text": a.Answer_Text
        }
        for a in all_answers
    ])

@answer_router.route('/answer/<int:question_id>/answers', methods=['POST'])
def create_answer(question_id): 
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    required_fields = ['Answer_Text', 'Is_Correct']

    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({
            "error": "Missing required fields",
            "missing": missing
        }), 400

    answer = Answer(
        ID_Question=question_id,
        Answer_Text=data['Answer_Text'],
        Is_Correct=data['Is_Correct']
    )

    answer.save()

    return jsonify({
        "message": "Answer created",
        "ID_Answer": answer.ID_Answer,
        "ID_Question": question_id,
        "Answer_Text": answer.Answer_Text,
        "Is_Correct": answer.Is_Correct
    }), 201


@answer_router.route('/answers/<int:answer_id>', methods=['PATCH'])
def update_answer(answer_id):
    answer = Answer.get_answer_by_id(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    data = request.get_json() or {}

    if not data:
        return jsonify({"error": "No data provided"}), 400

    allowed_fields = {"Answer_Text", "Is_Correct"}

    filtered_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not filtered_data:
        return jsonify({"error": "No valid fields to update"}), 400

    answer.update(**filtered_data)

    return jsonify({
        "message": "Answer updated",
        "ID_Answer": answer.ID_Answer,
        "ID_Question": answer.ID_Question,
        "Answer_Text": answer.Answer_Text,
        "Is_Correct": answer.Is_Correct
    }), 200


@answer_router.route('/answers/<int:answer_id>', methods=['DELETE'])
def delete_answer(answer_id):
    answer = Answer.get_answer_by_id(answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    answer.delete()

    return jsonify({
        "message": "Answer deleted",
        "ID_Answer": answer_id
    }), 200
