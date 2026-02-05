Sve rute na jednom mestu

Tok partije:
1. Na pocetku se poziva
POST /quizzes/<int:quiz_id>/start
VRACA:
{"session_id": session.pk,"quiz_id": quiz_id} --> session_id je STRING!!! vazan je zbog vise partija istovremeno

2. Azuriranje score-a pitanja ITD
GET /quizzes/get_session/<string:session_id> --> vraca sve podatke bitne za sisiju!

3. Ucitavanje sledeceg pitanja!
GET /questions/get_next 
Vraca sledece pitanje i odgovore

4. Provera da li je tacan odgovor
POST /quizzes/answer 
POTREBNA SU OVA 3 podatka da se salju!
    session_id = data.get("session_id")
    question_id = data.get("question_id")
    answer_id = data.get("answer_id")

Kao rezultat vraca sve neophodne podatke za sesiju

5. Kraj partije:
POST /quizzes/<string:session_id>/finish
OVO JE NOPHODNO POZVATI
Ukoliko vrati 200, partija je sacuvana!

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

PARTIJE / GAMES

GET /games/all --> vraca sve odigrane partije
GET /games/<int:ID_Game> --> vraca partiju sa zadatim ID-em
GET /games/<int:ID_Player> --> vraca sve partije odredjenog igraca
PUT /games/add --> dodavanje nove igre cita iz json-a!
PATCH /games/<int:ID_Game> --> azurira podatke o igri
DELETE /games/<int:ID_Game> --> brise igru


KVIZ / QUIZ

GET /quizzes/all --> vraca sve kvizove