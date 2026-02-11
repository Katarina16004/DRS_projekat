import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast"; // ✨ Dodato

import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { UserRole } from "../../enums/user/UserRole";

import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { questionApi } from "../../api_services/questions/QuestionAPIService";

import { NavbarForm } from "../../components/navbar/NavBarForm";
import { answerApi } from "../../api_services/answers/AnswerAPIService";

export default function GameQuestionsPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<QuizDTO | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionDTO | null>(null);

    const [remainingTime, setRemainingTime] = useState(0);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizFinished, setQuizFinished] = useState(false);

    const [navBarUser, setNavBarUser] = useState<{
        username: string;
        role: UserRole;
    } | null>(null);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role as UserRole });
        
        } catch {
            setNavBarUser({ username: "", role: "user" });
            
        }
    }, [token]);


    // HELPERS: map server response to DTO
    const mapQuestion = (raw: any): QuestionDTO => {
        // server vraća niz [questionObj, 200] ili samo objekat
        const questionObj = Array.isArray(raw) ? raw[0] : raw;
        return {
            ID_Question: questionObj.ID_Question,
            Question_Text: questionObj.Question_Text,
            Question_Points: questionObj.Question_Points,
            Answers: questionObj.Answers?.map((a: any) => ({
                ID_Answer: a.ID_Answer,
                Answer_Text: a.Answer_Text,
                Is_Correct: a.Is_Correct ?? false
            }))
        };
    };

    // START SESSION + LOAD QUIZ + FIRST QUESTION
    useEffect(() => {
        if (!token || !quizId) return;

        const startGame = async () => {
            try {
                console.log("🎮 Starting quiz...");

                const session = await quizApi.startQuiz(token, +quizId);
                console.log("✅ Session:", session.session_id);
                setSessionId(session.session_id);
                
                const quiz = await quizApi.getQuizById(token, +quizId);
                console.log("✅ Quiz:", quiz);
                setQuizData(quiz);

                setRemainingTime(quiz.Quiz_length * 60);

                const firstQuestionRaw = await questionApi.getNextQuestion(token, session.session_id);
                const firstQuestion = mapQuestion(firstQuestionRaw);
                console.log("✅ First question:", firstQuestion);
                setCurrentQuestion(firstQuestion);

                const sessionState = await quizApi.getSession(token, session.session_id);
                setScore(sessionState.score);
                setCorrectCount(sessionState.correct_count);
                setWrongCount(sessionState.wrong_count);
            } catch (err) {
                console.error("❌ Failed to start quiz:", err);
            } finally {
                setLoading(false);
            }
        };

        startGame();
    }, [token, quizId]);

    // TIMER
    useEffect(() => {
        if (!remainingTime || loading || quizFinished) return;

        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleQuizEnd();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime, loading, quizFinished]);

    // SUBMIT ANSWER
    const handleAnswer = async (answerId: number) => {
        if (!sessionId) return;
        try {
            console.log("📤 Submitting answer:", answerId);

            const response = await answerApi.sumbitAnswer(token, sessionId, answerId);
            console.log("✅ Answer response:", response);

            // Update session stats
            setScore(response.score);
            setCorrectCount(response.correct_count);
            setWrongCount(response.wrong_count);

            // Load next question
            const nextQuestionRaw = await questionApi.getNextQuestion(token, sessionId);
            
            // Provera da li je stigla poruka da je kviz završen
            if (nextQuestionRaw.Message === "Quiz finished" || nextQuestionRaw.Message) {
                console.log("🏁 All questions answered!");
                setQuizFinished(true);
                return;
            }

            const nextQuestion = mapQuestion(nextQuestionRaw);
            setCurrentQuestion(nextQuestion);

        } catch (e) {
            console.error("❌ Answer submit failed", e);
        }
    };

    // ✨ IZMENJENO - Prikazuje toast umesto navigacije
    const handleQuizEnd = async () => {
        if (!sessionId) return;
        try {
            const result = await quizApi.finishQuiz(token, sessionId);
            console.log("🏁 Quiz finished result:", result);
            
            toast.success(
                `Quiz Completed!\n\nFinal Score: ${result.Score}\n Correct: ${correctCount}\nWrong: ${wrongCount}\n\nWait few seconds...`,
                {
                    duration: 5000
                }
            );

            // reset nakon 3 sekunde
            setTimeout(() => {
                navigate('/user');
            }, 5000);

        } catch (e) {
            console.error("❌ Finish failed", e);
            toast.error("Failed to finish quiz!");
        }
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

    if (loading) return <div className="p-10 text-xl">Loading quiz...</div>;
    if (!quizData) return <div className="p-10 text-xl text-red-600">Missing data!</div>;


    if (!currentQuestion) return <div className="p-10 text-xl text-red-600">Missing question data!</div>;

    const answers = currentQuestion.Answers || [];
    const hasValidQuestion = currentQuestion.Question_Text && answers.length > 0;

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            <NavbarForm user={navBarUser} onLogout={confirmLogout} />
            <div
                className="flex-1 w-full pt-20 pb-16 flex flex-col items-center"
                style={{ background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)" }}
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">

                    {/* Header */}
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold">{quizData.Name}</h2>
                        <div className="text-xl font-semibold text-red-600">
                            ⏱ {formatTime(remainingTime)}
                        </div>
                    </div>

                    {/* Question or Finish Message */}
                    {hasValidQuestion ? (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 bg-blue-100 p-4 rounded-lg">
                                {currentQuestion.Question_Text}
                            </h3>

                            <div className="flex flex-col gap-3">
                                {answers.map((a, idx) => (
                                    <button
                                        key={a.ID_Answer}
                                        onClick={() => handleAnswer(a.ID_Answer)}
                                        className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-800 bg-yellow-100 hover:bg-blue-200 transition font-bold"
                                    >
                                        {idx + 1}. {a.Answer_Text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 text-center py-8">
                            <h3 className="text-2xl font-bold text-green-600 mb-4">
                                Finished Quiz
                            </h3>
                            <p className="text-gray-600">
                                Press finish button to get results
                            </p>
                        </div>
                    )}

                    {/* Footer stats */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex gap-6 font-semibold">
                            <div>Score: {score}</div>
                            <div className="text-green-600">✔ {correctCount}</div>
                            <div className="text-red-600">✖ {wrongCount}</div>
                        </div>

                        <button
                            onClick={handleQuizEnd}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition cursor-pointer"
                        >
                            Finish Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}