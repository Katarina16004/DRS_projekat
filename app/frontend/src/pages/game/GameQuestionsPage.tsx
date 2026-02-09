import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

    const [navBarUser, setNavBarUser] = useState<{
        username: string;
        role: UserRole;
    } | null>(null);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({
                username: decoded.username,
                role: decoded.role as UserRole,
            });
        } catch {
            setNavBarUser({
                username: "",
                role: "user",
            });
        }
    }, [token]);

    // START SESSION + LOAD QUIZ + FIRST QUESTION
    useEffect(() => {
        if (!token || !quizId) return;

        const startGame = async () => {
            try {
                // 1️⃣ start session
                const session = await quizApi.startQuiz(token, +quizId);
                setSessionId(session.session_id);

                alert(session.session_id)
                // 2️⃣ load quiz info
                const quiz = await quizApi.getQuizById(token, +quizId);
                setQuizData(quiz);

                // 3️⃣ timer
                setRemainingTime(quiz.Quiz_length * 60);

                // 4️⃣ first question
                const firstQuestion = await questionApi.getNextQuestion(token, session.session_id);
                setCurrentQuestion(firstQuestion);

                // 5️⃣ initial session state
                const sessionState = await quizApi.getSession(token, session.session_id);
                setScore(sessionState.score);
                setCorrectCount(sessionState.correct_count);
                setWrongCount(sessionState.wrong_count);

            } catch (err) {
                console.error("Failed to start quiz:", err);
            } finally {
                setLoading(false);
            }
        };
        alert('Stigli smo do ovde')
        startGame();
    }, [token, quizId]);

    // TIMER
    useEffect(() => {
        if (!remainingTime) return;

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
    }, [remainingTime]);

    // SUBMIT ANSWER
    const handleAnswer = async (answerId: number) => {
        if (!sessionId) return;

        try {
            // 1️⃣ send answer
            await answerApi.sumbitAnswer(token, sessionId, answerId);

            // 2️⃣ read updated session (source of truth)
            const sessionState = await quizApi.getSession(token, sessionId);

            setScore(sessionState.score);
            setCorrectCount(sessionState.correct_count);
            setWrongCount(sessionState.wrong_count);

            // 3️⃣ next question
            const nextQuestion = await questionApi.getNextQuestion(token, sessionId);

            if (!nextQuestion || nextQuestion.message) {
                handleQuizEnd();
                return;
            }

            setCurrentQuestion(nextQuestion);
        } catch (e) {
            console.error("Answer submit failed", e);
        }
    };

    // FINISH QUIZ
    const handleQuizEnd = async () => {
        if (!sessionId) return;

        try {
            const result = await quizApi.finishQuiz(token, sessionId);
            navigate(`/game-result/${result.ID_Game}`);
        } catch (e) {
            console.error("Finish failed", e);
        }
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    if (loading || !quizData || !currentQuestion) {
        return <div className="p-10 text-xl">Loading quiz...</div>;
    }

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            <NavbarForm user={navBarUser} onLogout={confirmLogout} />

            <div
                className="flex-1 w-full pt-20 pb-16 flex flex-col items-center"
                style={{
                    background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)"
                }}
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">

                    {/* Header */}
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold">{quizData.Name}</h2>
                        <div className="text-xl font-semibold text-red-600">
                            ⏱ {formatTime(remainingTime)}
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {currentQuestion.question_text}
                        </h3>

                        <div className="flex flex-col gap-3">
                            {currentQuestion.answers?.map(a => (
                                <button
                                    key={a.answer_id}
                                    onClick={() => handleAnswer(a.answer_id)}
                                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-300 hover:bg-blue-100 transition"
                                >
                                    {a.answer_text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer stats */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex gap-6 font-semibold">
                            <div>Score: {score}</div>
                            <div className="text-green-600">✔ {correctCount}</div>
                            <div className="text-red-600">✖ {wrongCount}</div>
                        </div>

                        <button
                            onClick={handleQuizEnd}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl"
                        >
                            Finish Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
