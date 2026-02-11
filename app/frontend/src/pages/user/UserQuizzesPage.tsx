import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { UserQuizCard } from "../../components/user/UserQuizzesCard";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import { quizApi } from "../../api_services/quizzes/QuizAPIService";

export default function UserQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

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

    quizApi.getQuizByStatus(token,1)
      .then(data => setQuizzes(data))
      .catch(err => console.error(err));
  }, [token]);


  const categories = useMemo(() => {
    const unique = new Set(quizzes.map(q => q.Category));
    return Array.from(unique);
  }, [quizzes]);


  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === "all") return quizzes;
    return quizzes.filter(q => q.Category === selectedCategory);
  }, [quizzes, selectedCategory]);


  const handlePlay = async (quizId: number) => {
    try {
      const session = await quizApi.startQuiz(token, quizId);
      navigate(`/quizzes/${quizId}/start`);
    } catch (e) {
      console.error("Failed to start quiz", e);
    }
  };


  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen font-poppins flex flex-col">
      <NavbarForm user={navBarUser} onLogout={() => setShowLogoutConfirm(true)} />

      <div
        className="flex-1 w-full pb-16"
        style={{
          background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
        }}
      >
        <div className="flex flex-col items-center pt-20 pb-2 w-full">

          {/* Header + filter */}
          <div className="flex w-full max-w-6xl justify-between items-center mb-8 px-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Quizzes
            </h2>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#82CAFF] text-[#4451A4] bg-white"
            >
              <option value="all">All categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

          </div>

          {/* Cards */}
          {filteredQuizzes.length === 0 ? (
            <p className="text-gray-500 mt-20">No quizzes available.</p>
          ) : (
            filteredQuizzes.map(q => (
              <UserQuizCard
                key={q.ID_Quiz}
                quiz={q}
                onPlay={handlePlay}
              />
            ))
          )}
        </div>
      </div>

      {/* Logout modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowLogoutConfirm(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10">
            <h3 className="text-2xl font-bold text-center mb-4">Log out?</h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 rounded-xl border"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-red-500 text-white cursor-pointer"
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
