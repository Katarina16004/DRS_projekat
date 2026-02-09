import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { AddQuizHomeForm } from "../../components/moderator/AddQuizHomeForm";
import type { UserRole } from "../../enums/user/UserRole";

export default function AddQuizHomePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const [navBarUser, setNavBarUser] = useState<{ username: string; role: UserRole; id: number } | null>(null);

    // 🔐 Decode token za navbar
    useState(() => {
        if (!token) return;
        try {
            const decoded: any = JSON.parse(atob(token.split(".")[1])); // ili jwtDecode(token)
            setNavBarUser({ username: decoded.username, role: decoded.role, id: decoded.id });
        } catch {
            setNavBarUser({ username: "", role: "user", id: 0 });
        }
    });

    const handleNext = (quizData: { name: string; category: string; duration: number }) => {
        // Čuvamo podatke i idemo na AddQuestionsPage
        navigate("/quiz/add-questions", { state: { ...quizData } });
    };

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            <NavbarForm
                user={navBarUser}
                onLogout={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            />

            <AddQuizHomeForm onNext={handleNext} />
        </div>
    );
}
