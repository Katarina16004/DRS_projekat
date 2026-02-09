import { useEffect, useState } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { jwtDecode } from "jwt-decode";
import type { UserRole } from "../../enums/user/UserRole";
import { AdminQuizzesForm } from "../../components/admin/quizzes/AdminQuizzesForm";
import type { QuizStatus } from "../../enums/quiz/QuizStatus";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";
import { GameAPIService } from "../../api_services/games/GameAPIService";


interface AdminQuiz {
    id: number;
    name: string;
    category: string;
    duration: number;
    numOfQuestions: number;
    author: string;
    status: QuizStatus;
}

export default function AdminQuizzesPage() {
    const token = localStorage.getItem("token");

    const [navBarUser, setNavBarUser] = useState<{
        username: string;
        role: UserRole;
    } | null>({
        username: "",
        role: "admin",
    });

    const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
                role: "admin",
            });
        }

        const mockQuizzes: AdminQuiz[] = [
            {
                id: 1,
                name: "General Knowledge",
                category: "Trivia",
                duration: 5,
                numOfQuestions: 10,
                author: "Admin",
                status: "pending",
            },
            {
                id: 2,
                name: "Science Quiz",
                category: "Science",
                duration: 7,
                numOfQuestions: 12,
                author: "Moderator1",
                status: "approved",
            },
            {
                id: 3,
                name: "History Challenge",
                category: "History",
                duration: 6,
                numOfQuestions: 8,
                author: "Admin",
                status: "rejected",
            },
        ];

        setQuizzes(mockQuizzes);
    }, [token]);

    const handleDelete = async (id: number) => {
        setQuizzes(prev => prev.filter(q => q.id !== id));
    };

    const handleApprove = async (id: number) => {
        setQuizzes(prev =>
            prev.map(q =>
                q.id === id ? { ...q, status: "approved" } : q
            )
        );
    };

    const handleReject = async (id: number) => {
        setQuizzes(prev =>
            prev.map(q =>
                q.id === id ? { ...q, status: "rejected" } : q
            )
        );
    };

    const handleDownloadPdf = async (id: number) => {
        try{
        await GameAPIService.get_games_from_quiz(token!,id)
        }
        catch(error){
            alert(error)
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            <NavbarForm user={navBarUser} onLogout={handleLogout} />

            <div
                className="flex-1 w-full pb-16"
                style={{
                    background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
                }}
            >
                <div className="flex flex-col items-center pt-20 pb-2 w-full">

                    {/* HEADER */}
                    <div className="w-full max-w-6xl mb-8 px-4">
                        <h2 className="text-3xl font-bold tracking-wider text-gray-800">
                            Manage Quizzes
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Approve, review or delete quizzes
                        </p>
                    </div>

                    {/* ADMIN LIST */}
                    <div className="w-full max-w-6xl px-4">
                        <AdminQuizzesForm
                            quizzes={quizzes}
                            onDelete={handleDelete}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onDownloadPdf={handleDownloadPdf}
                        />
                    </div>
                </div>
            </div>

            {/* LOGOUT MODAL */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowLogoutConfirm(false)}
                    />

                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            Log out?
                        </h3>
                        <p className="text-gray-600 text-center mb-8">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                                onClick={confirmLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
