import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { GameQuestionsForm } from "../../components/game/GameQuestonsForm";
import { questionApi } from "../../api_services/questions/QuestionAPIService";

interface QuizSession {
    quiz: QuizDTO;
    questions: QuestionDTO[];
}

export default function GameQuestionsPage() {
    const { quizId, sessionId } = useParams<{ quizId: string; sessionId: string }>();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const [quizData, setQuizData] = useState<QuizDTO | null>(null);
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [score, setScore] = useState(0);

    // Navbar user
    const [navBarUser, setNavBarUser] = useState<{
        username: string;
        role: UserRole;
    } | null>(null);

    // 🔐 Decode token za navbar
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

    // 🔄 Fetch kviza i pitanja
    useEffect(() => {
        if (!token || !quizId) return;

        const fetchQuizAndSession = async () => {
            try {
                const session = await quizApi.startQuiz(token, +quizId);
                console.log("Session started:", session);
                const quiz = await quizApi.getQuizById(token, +quizId);
                setQuizData(quiz);
                await questionApi.getNextQuestion(token, session.session_id)
              
                setRemainingTime(quiz.Quiz_length * 60);
            } catch (err) {
                console.error("Failed to start quiz session or fetch quiz:", err);
            }
        };

        fetchQuizAndSession();
    }, [token, quizId]);


    // ⏱ Timer za ceo kviz
    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    handleQuizEnd();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleAnswer = (selectedAnswerId: number) => {
       
        }
    };

    const handleQuizEnd = () => {
        
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

 

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            {/* Navbar */}
            <NavbarForm user={navBarUser} onLogout={confirmLogout} />

            {/* Sadržaj kviza */}
            <div className="flex-1 w-full pt-20 pb-16 flex flex-col items-center"
                style={{ background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)" }}
            >
                <GameQuestionsForm
                    quiz={quizData}
                    question={questions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                    remainingTime={remainingTime}
                />
            </div>
        </div>
    );
}
