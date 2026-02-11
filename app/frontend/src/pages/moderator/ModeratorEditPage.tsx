import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModeratorEditForm } from "../../components/moderator/ModeratorEditForm";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { questionApi } from "../../api_services/questions/QuestionAPIService";
import type { QuizQuestionsDTO } from "../../models/quizzes/QuizQuestionDTO";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export default function ModeratorEditPage() {
    const token = localStorage.getItem("token") || "";
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [navBarUser, setNavBarUser] = useState<{ username: string; role: UserRole; id: number } | null>(null);
    const [questions, setQuestions] = useState<QuizQuestionsDTO[]>([]);
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [editedQuestions, setEditedQuestions] = useState<{ id: number; text: string; points: number }[]>([]);

    // Decode user from token
    useEffect(() => {
        if (!token) return;
        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role as UserRole, id: decoded.id });
        } catch {
            setNavBarUser({ username: "", role: "user", id: 0 });
        }
    }, [token]);

    // Fetch quiz and questions
    useEffect(() => {
        if (!token || !quizId) return;

        const fetchQuiz = async () => {
            setLoading(true);
            try {
                const quizData = await quizApi.getQuizById(token, Number(quizId));
                setQuiz(quizData);

                // hvata ako je rejected
                if (quizData.Is_Accepted === 2) {
                    const quizQuestions = await quizApi.getQuestionFromQuiz(token, Number(quizId));
                    setQuestions([quizQuestions]);

                    setEditedQuestions(
                        quizQuestions.Questions.map(q => ({
                            id: q.ID_Question,
                            text: q.Question_Text,
                            points: q.Question_Points
                        }))
                    );
                } else {
                    toast.error("This quiz is not rejected and cannot be edited.");
                }
            } catch (error) {
                console.error("Ne mogu da dohvatim kviz:", error);
                toast.error("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [token, quizId]);

    const handleEditChange = (updated: { id: number; text: string; points: number }[]) => {
        setEditedQuestions(updated);
    };

    const handleFinishEditing = async () => {
        if (!editedQuestions.length || !quiz) return;

        const loadingToast = toast.loading("Updating questions...");
        try {
            for (const q of editedQuestions) {
                await questionApi.editQuestion(token, q.id, q.text, q.points, "");
            }

            toast.success("Quiz edited and sent for review!", { id: loadingToast });
            navigate("/moderator/quizzes");
        } catch (err) {
            toast.error("Failed to finish editing quiz.", { id: loadingToast });
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading quiz...</div>;

    if (!quiz || quiz.Is_Accepted !== 2)
        return (
            <div className="min-h-screen font-poppins flex flex-col bg-white">
                <NavbarForm user={navBarUser} onLogout={() => (window.location.href = "/login")} />
                <div className="flex-1 pt-16 text-center">
                    <p>This quiz is not rejected and cannot be edited.</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen flex flex-col font-poppins">

            <NavbarForm
                user={navBarUser}
                onLogout={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            />

            <div className="flex-1 w-full p-6 bg-gray-50">
                {questions.length > 0 && (
                    <ModeratorEditForm
                        quizName={quiz.Name}
                        questions={questions}
                        onFinish={handleEditChange}
                    />
                )}

            </div>
        </div>
    );
}
