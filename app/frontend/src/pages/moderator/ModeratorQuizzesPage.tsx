import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { ModeratorQuizzesForm } from "../../components/moderator/ModeratorQuizzesForm";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { UserRole } from "../../enums/user/UserRole";

export default function ModeratorQuizzesPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    const [navBarUser, setNavBarUser] = useState<{ username: string; role: UserRole; id: number } | null>(null);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded: any = JSON.parse(atob(token.split(".")[1])); 
            setNavBarUser({ username: decoded.username, role: decoded.role, id: decoded.id });
        } catch {
            setNavBarUser({ username: "", role: "user", id: 0 });
        }
    }, [token]);

    useEffect(() => {
        if (!token || !navBarUser) return;

        quizApi.getAllQuizzes(token)
            .then((data) => {
                const myQuizzes = data.filter((q) => q.ID_User === navBarUser.id);
                setQuizzes(myQuizzes);
            })
            .catch((err) => console.error(err));
    }, [token, navBarUser]);

    const handleDelete = (quizId: number) => {
        if (!token) return;
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        quizApi
            .deleteQuiz(token, quizId)
            .then(() => setQuizzes((prev) => prev.filter((q) => q.ID_Quiz !== quizId)))
            .catch((err) => console.error(err));
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

            {/* Moderator Quizzes Form */}
            <ModeratorQuizzesForm
                quizzes={quizzes}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
            />
        </div>
    );
}
