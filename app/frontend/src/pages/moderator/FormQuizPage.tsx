import { useState, useEffect } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";

import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { AnswerDTO } from "../../models/answers/AnswerDTO";
import { jwtDecode } from "jwt-decode";
import { FormQuizForm } from "../../components/moderator/FormQuizForm";

export default function FormQuizPage() {
    const token = localStorage.getItem("token") || "";

    const [navBarUser, setNavBarUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role });
        } catch {
            setNavBarUser({ username: "", role: "user" });
        }
    }, [token]);

    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [answers, setAnswers] = useState<AnswerDTO[]>([]);

    const [processedQuestions, setProcessedQuestions] = useState<
        { question: QuestionDTO; answers: AnswerDTO[] }[]
    >([]);

    const handleSubmitQuestion = (question: QuestionDTO, selectedAnswers: AnswerDTO[]) => {
        setProcessedQuestions(prev => [...prev, { question, answers: selectedAnswers }]);
        // Ukloni pitanje iz liste
        setQuestions(prev => prev.filter(q => q.ID_Question !== question.ID_Question));
    };

    const handleSendQuiz = () => {
        console.log("Quiz poslat adminu. Obrađena pitanja:", processedQuestions);
        // TODO: pozvati API da se quiz postavi na pending
    };

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            {/* Navbar */}
            <NavbarForm user={navBarUser} onLogout={() => (window.location.href = "/login")} />

            {/* Forma */}
            <div className="flex-1 pt-16">
                <FormQuizForm
                    questions={questions}
                    answers={answers}
                    onSubmitQuestion={handleSubmitQuestion}
                    onSendQuiz={handleSendQuiz}
                />
            </div>

            {/* Send Quiz dugme */}
            {questions.length === 0 && processedQuestions.length > 0 && (
                <div className="p-4 flex justify-center">
                    <button
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
                        onClick={handleSendQuiz}
                    >
                        Send Quiz
                    </button>
                </div>
            )}
        </div>
    );
}
