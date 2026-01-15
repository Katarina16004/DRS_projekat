from flask import Blueprint, request, jsonify
from infrastructure.classes.Answer import Answer

answer_router = Blueprint('answer_router',__name__)

@answer_router.route('/answers', methods=['GET'])
def get_all_answers():
    answers = Answer.get_all()

    return jsonify([
        {
            "ID_Question": a.ID_Question,
            "ID_Answer": a.ID_Answer,
            "Answer_Text": a.Answer_Text,
            "Is_Correct": a.Is_Correct
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
            "Answer_Text": a.Answer_Text,
            "Is_Correct": a.Is_Correct
        }
        for a in answers
    ])


@answer_router.route(
    '/answer/<int:question_id>/answers/<int:answer_id>',methods=['GET'])
def get_answer(question_id, answer_id):
    answer = Answer.get_answer_by_id(question_id, answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    return jsonify({
        "ID_Question": answer.ID_Question,
        "ID_Answer": answer.ID_Answer,
        "Answer_Text": answer.Answer_Text,
        "Is_Correct": answer.Is_Correct
    })

@answer_router.route('/answer/<int:question_id>/answers',methods=['POST'])
def create_answer(question_id):
    data = request.json

    if not data or not all(k in data for k in ['ID_Answer', 'Answer_Text', 'Is_Correct']):
        return jsonify({"error": "Invalid request body"}), 400
    #TODO dodati validaciju
    answer = Answer(
        ID_Question=question_id,
        ID_Answer=data['ID_Answer'],
        Answer_Text=data['Answer_Text'],
        Is_Correct=data['Is_Correct']
    )

    answer.save()

    return jsonify({"message": "Answer created"}), 201


@answer_router.route('/answer/<int:question_id>/answers/<int:answer_id>',methods=['PATCH'])
def update_answer(question_id, answer_id):
    answer = Answer.get_answer_by_id(question_id, answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404
    #TODO dodati validaciju
    data = request.json
    answer.update(**data)

    return jsonify({"message": "Answer updated"})


@answer_router.route('/answer/<int:question_id>/answers/<int:answer_id>', methods=['DELETE'])
def delete_answer(question_id, answer_id):
    answer = Answer.get_answer_by_id(question_id, answer_id)

    if not answer:
        return jsonify({"message": "Answer not found"}), 404

    answer.delete()

    return jsonify({"message": "Answer deleted"})