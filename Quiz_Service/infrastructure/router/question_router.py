from flask import Blueprint, request, jsonify
from infrastructure.classes.Answer import Answer

answer_router = Blueprint('question_router',__name__)