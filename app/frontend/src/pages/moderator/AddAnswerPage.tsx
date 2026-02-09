import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";

import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { AnswerDTO } from "../../models/answers/AnswerDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import { AddAnswersForm } from "../../components/moderator/AddAnswerForm";

export default function AddAnswersPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token") || "";

    const questions: QuestionDTO[] = location.state?.questions || [];

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

    const handleNext = (answers: Record<number, AnswerDTO[]>) => {
        console.log("Answers ready to submit:", answers);
       //ruta se treba menjati
        navigate("/quiz-summary", { state: { questions, answers } });
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <NavbarForm user={navBarUser} onLogout={handleLogout} />

            {/* Sadržaj stranice */}
            <div className="flex-1 pt-20">
                <AddAnswersForm questions={questions} onNext={handleNext} />
            </div>
        </div>
    );
}
