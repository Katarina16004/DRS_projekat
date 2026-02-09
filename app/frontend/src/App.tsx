
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
          path="/admin/quizzes"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminQuizzesPage />
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