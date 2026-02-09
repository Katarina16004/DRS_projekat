import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import { AddQuestionsForm } from "../../components/moderator/AddQuestionForm";

export default function AddQuestionsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleNext = (questions: QuestionDTO[]) => {
        console.log("Questions to add answers for:", questions);
        navigate("/add-answers", { state: { questions } }); //ruta se verovatno treba popravljati
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <NavbarForm user={navBarUser} onLogout={handleLogout} />

            {/* Sadržaj stranice */}
            <div className="flex-1 pt-20">
                <AddQuestionsForm onNext={handleNext} />
            </div>
        </div>
    );
}
