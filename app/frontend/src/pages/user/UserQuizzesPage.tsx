import { useEffect, useMemo, useState } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { jwtDecode } from "jwt-decode";
import { UserQuizCard } from "../../components/user/UserQuizzesCard";

export default function UserQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = localStorage.getItem("token");

  const [navBarUser, setNavBarUser] = useState<{
    username: string;
    role: UserRole;
  } | null>({
    username: "",
    role: 'user'
  });

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
        role: "user",
      });
    }

    // Mock podaci za prikaz
    const mockQuizzes: QuizDTO[] = [
      {
        id: 1,
        name: "General Knowledge",
        author: "Admin",
        category: "Trivia",
        duration: 5,
        status: "approved",
        numOfQuestions: 10
      },
      {
        id: 2,
        name: "Science Quiz",
        author: "Moderator1",
        category: "Science",
        duration: 7,
        status: "approved",
        numOfQuestions: 12
      },
      {
        id: 3,
        name: "History Challenge",
        author: "Admin",
        category: "History",
        duration: 6,
        status: "approved",
        numOfQuestions: 8
      }
    ];

    setQuizzes(mockQuizzes);
  }, [token]);

  const categories = useMemo(() => {
    const unique = new Set(quizzes.map(q => q.category));
    return Array.from(unique);
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === "all") return quizzes;
    return quizzes.filter(q => q.category === selectedCategory);
  }, [quizzes, selectedCategory]);

  const handlePlay = (quizId: number) => {
    console.log("Play quiz:", quizId);
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

          {/* Header + filter */}
          <div className="flex w-full max-w-6xl justify-between items-center mb-8 px-4">
            <h2 className="text-3xl font-bold tracking-wider text-gray-800">
              Quizzes
            </h2>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#82CAFF] text-[#4451A4] font-medium bg-white cursor-pointer"
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
                key={q.id}
                quiz={q}
                onPlay={handlePlay}
              />
            ))
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10 font-poppins">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Log out?
            </h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium"
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
