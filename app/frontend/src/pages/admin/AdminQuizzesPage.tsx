import { useEffect, useState } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import type { UserRole } from "../../enums/user/UserRole";
import { AdminQuizzesForm } from "../../components/admin/quizzes/AdminQuizzesForm";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { questionApi } from "../../api_services/questions/QuestionAPIService";
import { GameAPIService } from "../../api_services/games/GameAPIService";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { confirmDelete } from "../../components/toast/toastYesNo";

export default function AdminQuizzesPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    const [navBarUser, setNavBarUser] = useState<{ username: string; role: UserRole; id: number } | null>(null);

    useEffect(() => {
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role as UserRole, id: decoded.id });
        } catch {
            setNavBarUser({ username: "", role: "admin", id: 0 });
        }
    }, [token]);

    useEffect(() => {
        if (!token || !navBarUser) return;

        quizApi.getAllQuizzes(token)
            .then((data) => {
                setQuizzes(data);
            })
            .catch(err => console.error(err));
    }, [token, navBarUser]);

    // DELETE kviza (isto kao kod moderatora)
    const handleDelete = (quizId: number) => {
        confirmDelete(
            "Are you sure you want to delete this quiz?",
            async () => {
                const loadingToast = toast.loading("Deleting quiz...");
                try {
                    // 1. Učitaj sva pitanja iz kviza
                    const questionsResponse = await questionApi.getAllQuestions(token, quizId);
                    const questions = (questionsResponse as any).Questions || [];

                    if (questions.length > 0) {
                        toast.loading(`Removing ${questions.length} question(s)...`, { id: loadingToast });
                        for (const question of questions) {
                            await questionApi.remove_question_to_quiz(token, quizId, question.ID_Question);
                        }
                    }

                    // 2. Briši kviz
                    toast.loading("Deleting quiz...", { id: loadingToast });
                    await quizApi.deleteQuiz(token, quizId);

                    // 3. Update UI
                    setQuizzes(prev => prev.filter(q => q.ID_Quiz !== quizId));
                    toast.success("Quiz deleted successfully!", { id: loadingToast });
                } catch (err) {
                    toast.error("Failed to delete quiz. Please try again.", { id: loadingToast });
                }
            },
            () => {
                toast.error("Quiz deletion cancelled.", { icon: "🚫" });
            }
        );
    };

    const handleDownloadPdf = async (id: number) => {
        try {
            await GameAPIService.get_games_from_quiz(token, id);
            toast.success("Successfully created the report for the quiz! It is sent to your e-mail adress.")
        } catch (error) {
            alert(error);
        }
    };

    const handlePreview = (id: number) => navigate(`/quizzes/${id}/questions`);
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            <NavbarForm user={navBarUser} onLogout={handleLogout} />

            <div className="flex-1 w-full pb-16" style={{ background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)` }}>
                <div className="flex flex-col items-center pt-20 pb-2 w-full">
                    <div className="w-full max-w-6xl mb-8 px-4">
                        <h2 className="text-3xl font-bold tracking-wider text-gray-800">Manage Quizzes</h2>
                        <p className="text-gray-500 mt-1">Review, delete, or download quizzes</p>
                    </div>

                    <div className="w-full max-w-6xl px-4">
                        <AdminQuizzesForm
                            quizzes={quizzes}
                            onDelete={handleDelete} // DELETE logika kao kod moderatora
                            onDownloadPdf={handleDownloadPdf}
                            onPreview={handlePreview}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
