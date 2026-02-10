from infrastructure.classes.Answer import Answer
from flask import Blueprint, request, jsonify
from infrastructure.classes.QuizSession import QuizSession 
from infrastructure.classes.Question import Question
from infrastructure.classes.QuestionQuiz import QuestionQuiz

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

@question_router.route('/questions/get_next/<string:ID_Session>', methods=['GET'])
def get_next_question(ID_Session):
    session_id = ID_Session
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    session = QuizSession.get_session(session_id)
    if not session:
        return jsonify({"error": "Session expired"}), 404

    question_quiz = QuestionQuiz.get_question_by_offset(quiz_id=session.quiz_id, offset=session.current_question_index)

    if not question_quiz:
        return jsonify({"message": "Quiz finished"}), 200

    question = Question.get_question_by_ID(question_quiz.ID_Question)
    answers = Answer.get_answers_by_question(question_quiz.ID_Question)

    return jsonify({
        "question_index": session.current_question_index,
        "ID_Question": question.ID_Question,
        "Question_Text": question.Question_Text,
        "Question_Points": question.Question_Points,
        "Question_Category": question.Question_Category,
        "Answers": [
            {
                "ID_Answer": a.ID_Answer,
                "Answer_Text": a.Answer_Text
            }
            for a in answers
        ]
    }), 200


@question_router.route('/questions/<int:ID_Question>/quizzes', methods=['GET'])
def get_quizzes_with_question(ID_Question):
    rows = QuestionQuiz.get_quizzes_with_question(ID_Question)

    if not rows:
        return jsonify({
            "ID_Question": ID_Question,
            "Quizzes": []
        }), 200

    quiz_ids = [row.ID_Quiz for row in rows]

    return jsonify({
        "ID_Question": ID_Question,
        "Quizzes": quiz_ids
    }), 200


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


@question_router.route("/quizzes/<int:quiz_id>/questions/<int:question_id>", methods=["POST"])
def assign_question_to_quiz(quiz_id, question_id):
    existing = QuestionQuiz.query.filter_by(
        ID_Quiz=quiz_id,
        ID_Question=question_id
    ).first()

    if existing:
        return jsonify({"message": "Question already assigned to quiz"}), 400

    relation = QuestionQuiz(
        ID_Quiz=quiz_id,
        ID_Question=question_id
    )
    relation.save()

    return jsonify({
        "message": "Question assigned to quiz successfully",
        "quiz_id": quiz_id,
        "question_id": question_id
    }), 201

@question_router.route("/quizzes/<int:quiz_id>/questions/<int:question_id>", methods=["DELETE"])
def remove_question_from_quiz(quiz_id, question_id):
    relation = QuestionQuiz.query.filter_by(
        ID_Quiz=quiz_id,
        ID_Question=question_id
    ).first()

    if not relation:
        return jsonify({"message": "Relation not found"}), 404

    relation.delete()
    return jsonify({"message": "Question removed from quiz"})
