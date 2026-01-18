Sve rute na jednom mestu

PITANJA - QUESTIONS

GET /questions/all --> Vraca sva pitanja
GET /questions/category/<string:category> --> Vraca sva pitanja iz odabrane kategorije
(ukoliko je kategorija "any" vraca 10 random pitanja)
GET /questions/<string:category>/<int:number_of_questions> --> Vraca n pitanja iz odredjene kategorije (ukoliko je n=0 vraca 10 pitanja)
GET /questions/random/<int:number_of_questions> --> Vraca n random pitanja
GET /questions/<int:ID_Question> --> Vraca detalje o pitanju

PATCH /question/<int:ID_Question>
DELETE /question/<int:ID_Question>
POST /question --> dodavanje


ODGOVORI - ANSWERS

GET /answers  --> Vraca sve odgovore 
GET /answer/<question_id>/answers --> Vraca sve odgovore na poslat id pitanja
GET /answer/<question_id>/answers/<answer_id> --> vraca podatke za specifican odgovorf

POST /answer/selected_questions --> Vraca odgovore na kolekciju poslatih pitanja
znaci prima json 
{
  "question_ids":[1,2,4,2,5,...,n]
}

POST /answer/<question_id>/answers --> dodavanje novog odgovora
body
{
  "ID_Answer": 5,
  "Answer_Text": "Plava Motorola",
  "Is_Correct": true
}

PATCH /answer/<question_id>/answers/<answer_id>
body
{
    samo parametri koji se menjaju u json formatu
}

DELETE /answer/<question_id>/answers/<answer_id>


