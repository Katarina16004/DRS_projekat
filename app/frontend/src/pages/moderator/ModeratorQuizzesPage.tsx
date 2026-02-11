import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { ModeratorQuizzesForm } from "../../components/moderator/ModeratorQuizzesForm";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { questionApi } from "../../api_services/questions/QuestionAPIService";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { confirmDelete } from "../../components/toast/toastYesNo";

export default function ModeratorQuizzesPage() {
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
            setNavBarUser({ username: "", role: "user", id: 0 });
        }
    }, [token]);

    useEffect(() => {
        if (!token || !navBarUser) return;

        quizApi.getAllQuizzes(token)
            .then((data) => {
                // filtriraj kvizove po autoru (ID_User)
                const myQuizzes = data.filter(q => q.ID_User === navBarUser.id);
                setQuizzes(myQuizzes);
            })
            .catch(err => console.error(err));
    }, [token, navBarUser]);

    const handleDelete = (quizId: number) => {
    confirmDelete(
        "Are you sure you want to delete this quiz?",
        async () => {
            const loadingToast = toast.loading("Deleting quiz...");
            try {
                // 1. Prvo učitaj sva pitanja iz kviza
                const questionsResponse = await questionApi.getAllQuestions(token, quizId);
                const questions = (questionsResponse as any).Questions || [];

                if (questions.length > 0) {
                    toast.loading(`Removing ${questions.length} question(s)...`, { id: loadingToast });
                    for (const question of questions) {
                        await questionApi.remove_question_to_quiz(token, quizId, question.ID_Question);
                    }
                }

                toast.loading("Deleting quiz...", { id: loadingToast });
                await quizApi.deleteQuiz(token, quizId);

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

    const handleEdit = (quizId: number) => navigate(`/quiz/edit/${quizId}`);
    const handleCreate = () => navigate("/quiz/create");

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            {/* Navbar */}
            <NavbarForm
                user={navBarUser}
                onLogout={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            />

            {/* Gradient pozadina */}
            <div
                className="flex-1 w-full pb-16"
                style={{
                    background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
                }}
            >
                <div className="flex flex-col items-center pt-20 pb-4 w-full">

                    {/* Header + dugme */}
                    <div className="flex w-full max-w-6xl justify-between items-center mb-8 px-4">
                        <h2 className="text-3xl font-bold text-gray-800">My Quizzes</h2>
                    </div>

                    {/* Lista kvizova */}
                    <ModeratorQuizzesForm
                        quizzes={quizzes}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreate={handleCreate}
                    />

                    {quizzes.length === 0 && (
                        <p className="text-gray-500 mt-20 text-center">
                            You have not created any quizzes yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}