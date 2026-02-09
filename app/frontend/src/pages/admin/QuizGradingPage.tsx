import { useState, useEffect } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { QuizGradingForm } from "../../components/admin/quiz_grading/QuizGradingForm";

export default function QuizGradingPage() {
    const token = localStorage.getItem("token") || "";
    const { quizId } = useParams<{ quizId: string }>();

    const [navBarUser, setNavBarUser] = useState<{ username: string; role: string } | null>(null);
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role });
        } catch {
            setNavBarUser({ username: "", role: "user" });
        }

        // TODO: fetch pitanja iz sesije ili API
        setQuestions([
            {
                question_id: 1,
                question_text: "Primer pitanja 1",
                answers: [
                    { answer_id: 1, answer_text: "Odgovor A", answer_is_correct: true },
                    { answer_id: 2, answer_text: "Odgovor B", answer_is_correct: false },
                ],
            },
            {
                question_id: 2,
                question_text: "Primer pitanja 2",
                answers: [
                    { answer_id: 3, answer_text: "Odgovor C", answer_is_correct: false },
                    { answer_id: 4, answer_text: "Odgovor D", answer_is_correct: true },
                ],
            },
        ]);
    }, [token]);

    const handleFinish = (approved: boolean, reason?: string) => {
        console.log("Kviz završen. Approved:", approved, "Reason:", reason);
        // TODO: pozvati API da se pošalje mejl moderatoru
    };

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            <NavbarForm user={navBarUser} onLogout={() => (window.location.href = "/login")} />
            <div className="flex-1 pt-16">
                <QuizGradingForm questions={questions} onFinish={handleFinish} />
            </div>
        </div>
    );
}
