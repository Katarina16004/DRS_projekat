import { useState, useEffect } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { useParams, useNavigate } from "react-router-dom";
import { QuizGradingForm } from "../../components/admin/quiz_grading/QuizGradingForm";
import { jwtDecode } from "jwt-decode";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import type { QuizQuestionsDTO } from "../../models/quizzes/QuizQuestionDTO";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";

export default function QuizGradingPage() {
    const token = localStorage.getItem("token") || "";
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [navBarUser, setNavBarUser] = useState<{ username: string; role: string } | null>(null);
    const [questions, setQuestions] = useState<QuizQuestionsDTO[]>([]);
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || !quizId) return;

        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role });
        } catch {
            setNavBarUser({ username: "", role: "user" });
        }

        const fetchQuiz = async () => {
            try {
                const quizData = await quizApi.getQuizById(token, Number(quizId));
                setQuiz(quizData);

                // Ako je pending, fetch pitanja
                if (quizData.Is_Accepted === 0) {
                    const quizQuestions = await quizApi.getQuestionFromQuiz(token, Number(quizId));
                    setQuestions([quizQuestions]);
                }
            } catch (error) {
                console.error("Ne mogu da dohvatim kviz:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [token, quizId]);

    const handleFinish = async (approved: boolean, reason?: string) => {
        if (!quiz) return;

        try {
            if (approved) {
                await quizApi.acceptQuiz(token, quiz.ID_Quiz);
            } else {
                await quizApi.rejectQuiz(token, quiz.ID_Quiz, reason || "");
            }
            navigate("/admin/quizzes"); // vrati na listu kvizova
        } catch (error) {
            console.error("Neuspešno update-ovanje statusa kviza:", error);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading quiz...</div>;

    // Ako kviz nije pending
    if (!quiz || quiz.Is_Accepted !== 0) {
        return (
            <div className="min-h-screen font-poppins flex flex-col bg-white">
                <NavbarForm user={navBarUser} onLogout={() => (window.location.href = "/login")} />
                <div className="flex-1 pt-16 text-center">
                    <p>Ovaj kviz nije pending i ne može se pregledati.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-poppins flex flex-col bg-white">
            <NavbarForm user={navBarUser} onLogout={() => (window.location.href = "/login")} />
            <div className="flex-1 pt-16">
                <QuizGradingForm
                    quizName={quiz?.Name || "Quiz"}
                    questions={questions}
                    onFinish={handleFinish} />
            </div>
        </div>
    );
}
