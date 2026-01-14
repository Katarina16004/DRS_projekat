import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { RemoveValueByKey } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string | string[]; 
  redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    RemoveValueByKey("jwt");
    logout();
  };

  // Loading state dok se auth stanje učitava
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  // Ako nije prijavljen, šalji na login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Ako je potrebna određen role, proveri pristup
  if (requiredRole) {
    const rolesAllowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!rolesAllowed.includes(user?.role ?? "")) {
      return (
        <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md shadow-2xl border border-orange-300 rounded-2xl p-10 w-full max-w-lg text-center">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              You do not have permission
            </h2>
            <p className="text-gray-800 text-lg mb-6">
              Required role:{" "}
              <span className="font-semibold text-orange-500">
                {rolesAllowed.join(", ")}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl transition font-semibold"
            >
              Log out
            </button>
          </div>
        </main>
      );
    }
  }

  // Ako je sve OK, renderuj decu
  return <>{children}</>;
};