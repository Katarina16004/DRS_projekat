from flask import Blueprint, request, jsonify
from infrastructure.classes.Question import Question

question_router = Blueprint('question_router',__name__)

@question_router.route('/questions/all', methods=['GET'])
def get_all_questions():
    questions = Question.get_all()

    return jsonify([
        {
            "ID_Question": q.ID_Question,
            "Question_Text": q.Question_Text,
            "Question_Points": q.Question_Points,
            "Question_Category": q.Question_Category
        }
        for q in questions
    ])

@question_router.route('/questions/category/<string:category>', methods=['GET'])
def get_questions_from_category(category):

    if category.lower() == "any":
        questions = Question.get_n_random_questions()
    else:
        questions = Question.get_questions_from_category(category)

    return jsonify([
        {
            "ID_Question": q.ID_Question,
            "Question_Text": q.Question_Text,
            "Question_Points": q.Question_Points,
            "Question_Category": q.Question_Category
        }
        for q in questions
    ])


@question_router.route('/questions/<string:category>/<int:number_of_questions>', methods=['GET'])
def get_n_questions_from_category(category, number_of_questions):

    if number_of_questions <= 0:
        return jsonify({"error": "number_of_questions must be a positive integer"}), 400

    if category.lower() == "any":
        questions = Question.get_n_random_questions(number_of_questions)
    else:
        questions = Question.get_random_questions_from_category(
            category,
            number_of_questions
        )

    return jsonify([
        {
            "ID_Question": q.ID_Question,
            "Question_Text": q.Question_Text,
            "Question_Points": q.Question_Points,
            "Question_Category": q.Question_Category
        }
        for q in questions
    ])


@question_router.route('/questions/random/<int:number_of_questions>', methods=['GET'])
def get_n_random_questions(number_of_questions):

    if number_of_questions <= 0:
        return jsonify({"error": "number_of_questions must be a positive integer"}), 400

    questions = Question.get_n_random_questions(number_of_questions)

    return jsonify([
        {
            "ID_Question": q.ID_Question,
            "Question_Text": q.Question_Text,
            "Question_Points": q.Question_Points,
            "Question_Category": q.Question_Category
        }
        for q in questions
    ])



@question_router.route('/questions/<int:ID_Question>', methods=['GET'])
def get_question_by_ID(ID_Question):

    q = Question.get_question_by_ID(ID_Question)

    if not q:
        return jsonify({"error": "Question not found"}), 404

    return jsonify({
        "ID_Question": q.ID_Question,
        "Question_Text": q.Question_Text,
        "Question_Points": q.Question_Points,
        "Question_Category": q.Question_Category
    })

@question_router.route('/question/<int:ID_Question>', methods=['PATCH'])
def update_question(ID_Question):

    q = Question.get_question_by_ID(ID_Question)

    if not q:
        return jsonify({"error": "Question not found"}), 404

    data = request.get_json() or {}

    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    q.update(**data)

    return jsonify({
        "message": "Question updated successfully",
        "ID_Question": q.ID_Question,
        "Question_Text": q.Question_Text,
        "Question_Points": q.Question_Points,
        "Question_Category": q.Question_Category
    })

@question_router.route('/question/<int:ID_Question>', methods=['DELETE'])
def delete_question(ID_Question):

    q = Question.get_question_by_ID(ID_Question)

    if not q:
        return jsonify({"error": "Question not found"}), 404

    q.delete()

    return jsonify({
        "message": "Question deleted successfully",
        "ID_Question": ID_Question
    })

@question_router.route('/question', methods=['POST'])
def create_question():

    data = request.get_json() or {}

    required_fields = ["Question_Text", "Question_Points"]

    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({
            "error": "Missing required fields",
            "missing_fields": missing
        }), 400

    try:
        question = Question(
            Question_Text=data["Question_Text"],
            Question_Points=int(data["Question_Points"]),
            Question_Category=data.get("Question_Category")
        )
    except ValueError:
        return jsonify({"error": "Question_Points must be an integer"}), 400

    question.save()

    return jsonify({
        "message": "Question created successfully",
        "ID_Question": question.ID_Question,
        "Question_Text": question.Question_Text,
        "Question_Points": question.Question_Points,
        "Question_Category": question.Question_Category
    }), 201