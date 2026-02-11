import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";

import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { AnswerDTO } from "../../models/answers/AnswerDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import { AddAnswersForm } from "../../components/moderator/AddAnswerForm";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { questionApi } from "../../api_services/questions/QuestionAPIService";
import { answerApi } from "../../api_services/answers/AnswerAPIService";
import toast from "react-hot-toast";

export default function AddAnswersPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token") || "";

    const state = location.state as {
        name: string;
        category: string;
        duration: number;
        questions: QuestionDTO[];
    } | null;

    const [navBarUser, setNavBarUser] = useState<{
        username: string;
        role: UserRole;
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Provera da li postoje potrebni podaci
    useEffect(() => {
        if (!state || !state.questions) {
            navigate("/quiz/create");
        }
    }, [state, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleNext = async (answers: Record<number, AnswerDTO[]>) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            console.log("📝 Starting quiz creation...");
            console.log("Quiz data:", state);
            console.log("Answers:", answers);
            
            // 1. Kreiraj kviz
            const quizResponse = await quizApi.createQuiz(
                token,
                state!.name,
                state!.category,
                state!.duration
            );
            console.log("✅ Quiz created response:", quizResponse);
            
            // ✨ Ekstrakcija ID-a - server vraća objekat {ID_Quiz: 13}
            const quizId = typeof quizResponse === 'number' 
                ? quizResponse 
                : (quizResponse as any).ID_Quiz;
            
            console.log("✅ Quiz ID:", quizId);
            
            // Proveri da li je quizId validan
            if (!quizId || typeof quizId !== 'number') {
                throw new Error("Invalid quiz ID returned from server");
            }
            
            toast.success("Quiz created!");

            // 2. Dodaj pitanja i odgovore
            for (const question of state!.questions) {
                try {
                    console.log("Creating question:", question.Question_Text);
                    
                    // Dodaj pitanje
                    const createdQuestionResponse = await questionApi.createQuestion(
                        token,
                        question.Question_Text,
                        question.Question_Points,
                        state!.category
                    );
                    console.log("✅ Question created response:", createdQuestionResponse);
                    
                    // ✨ Ekstrakcija pitanja - server vraća niz [questionObj, statusCode]
                    const createdQuestion = Array.isArray(createdQuestionResponse) 
                        ? createdQuestionResponse[0] 
                        : createdQuestionResponse;
                    
                    console.log("✅ Extracted question:", createdQuestion);
                    console.log("✅ Question ID:", createdQuestion.ID_Question);
                    
                    // Provera da li ID postoji
                    if (!createdQuestion.ID_Question) {
                        throw new Error("Question ID is missing from server response");
                    }

                    // Poveži pitanje sa kvizom
                    await questionApi.assign_question_to_quiz(
                        token,
                        quizId,
                        createdQuestion.ID_Question
                    );
                    console.log("✅ Question assigned to quiz");

                    // Dodaj odgovore za to pitanje
                    const questionAnswers = answers[question.ID_Question] || [];
                    console.log(`Adding ${questionAnswers.length} answers...`);
                    
                    for (const answer of questionAnswers) {
                        await answerApi.createAnswer(
                            token,
                            createdQuestion.ID_Question,
                            answer.Answer_Text,
                            answer.Is_Correct
                        );
                    }
                    console.log(`✅ Added ${questionAnswers.length} answers for question`);
                } catch (err: any) {
                    console.error("❌ Error adding question/answers:", err);
                    console.error("Error status:", err.response?.status);
                    console.error("Error data:", err.response?.data);
                    throw err;
                }
            }

            console.log("🎉 Quiz creation completed successfully!");
            toast.success("Quiz created successfully! Redirecting...", { duration: 1500 });
            
            // Redirect na moderator quizzes page
            setTimeout(() => {
                console.log("Navigating to /moderator/quizzes");
                navigate("/moderator/quizzes");
            }, 1500);

        } catch (error: any) {
            console.error("❌ Failed to create quiz:", error);
            console.error("Error details:", error.response?.data || error.message);
            toast.error(`Failed to create quiz: ${error.response?.data?.message || error.message}`);
            setIsSubmitting(false);
        }
    };

    if (!state) return null;

    if (isSubmitting) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavbarForm user={navBarUser} onLogout={handleLogout} />
                <div
                    className="flex-1 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)" }}
                >
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Creating Quiz...</h2>
                        <p className="text-gray-600">Please wait while we process your quiz.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <NavbarForm user={navBarUser} onLogout={handleLogout} />

            {/* Sadržaj stranice */}
            <div className="flex-1 pt-20">
                <AddAnswersForm questions={state.questions} onNext={handleNext} />
            </div>
        </div>
    );
}