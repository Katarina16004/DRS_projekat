
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import RegistrationPage from "./pages/auth/RegistrationPage";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminUsersPage from "./pages/admin/UsersPage";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import UserPage from "./pages/user/UserQuizzesPage";
import { authApi } from "./api_services/auth/AuthAPIService";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";
import GameQuestionsPage from "./pages/game/GameQuestionsPage";
import QuizGradingPage from "./pages/admin/QuizGradingPage";
import ModeratorQuizzesPage from "./pages/moderator/ModeratorQuizzesPage";

import AddQuizHomePage from "./pages/moderator/AddQuizHomePage";
import AddQuestionsPage from "./pages/moderator/AddQuestionPage";
import AddAnswersPage from "./pages/moderator/AddAnswerPage";
import ModeratorEditPage from "./pages/moderator/ModeratorEditPage";
import LeaderBoardPage from "./pages/game/LeaderBoardPage";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            padding: "16px",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "600",
          },
          success: { style: { background: "green" } },
          error: { style: { background: "red" } },
        }}
      />
      <Routes>
        {/* Javno dostupno */}
        <Route path="/login" element={<LoginPage authApi={authApi} />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Zaštićeno za sve ulogovane */}
        <Route
          path="/profileInfo"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Samo za admin rolu */}
        <Route
          path="/adminUsers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole={["user", "moderator"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId/start"
          element={
            <ProtectedRoute requiredRole={["user", "moderator"]}>
              <GameQuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminQuizzesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/:quizId/questions"
          element={
            <ProtectedRoute requiredRole="admin">
              <QuizGradingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/quizzes"
          element={
            <ProtectedRoute requiredRole="moderator">
              <ModeratorQuizzesPage />
            </ProtectedRoute>
          }
        />

        {/* RUTE ZA KREIRANJE KVIZA */}
        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute requiredRole="moderator">
              <AddQuizHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/add-questions"
          element={
            <ProtectedRoute requiredRole="moderator">
              <AddQuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/add-answers"
          element={
            <ProtectedRoute requiredRole="moderator">
              <AddAnswersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/quiz/edit/:quizId"
          element={
            <ProtectedRoute requiredRole="moderator">
              <ModeratorEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/:quizId/leaderboard"
          element={
            <ProtectedRoute requiredRole={["user", "moderator"]}>
              <LeaderBoardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/404" element={<NotFoundStranica />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;