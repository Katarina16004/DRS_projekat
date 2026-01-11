Sve rute na jednom mestu

GET /answers
GET /questions/<question_id>/answers
GET /questions/<question_id>/answers/<answer_id>

POST /questions/<question_id>/answers
body
{
  "ID_Answer": 5,
  "Answer_Text": "Plava Motorola",
  "Is_Correct": true
}

PATCH /questions/<question_id>/answers/<answer_id>
body
{
    samo parametri koji se menjaju u json formatu
}
DELETE /questions/<question_id>/answers/<answer_id>

