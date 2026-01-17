import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import type { UserRole } from "../../enums/user/UserRole";

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [navBarUser, setNavBarUser] = useState<{ username: string; role: UserRole } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      setNavBarUser({
        username: decoded.username,
        role: decoded.role as UserRole,
      });
    } catch (err) {
      setNavBarUser(null);
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col font-poppins">
      <NavbarForm user={navBarUser} onLogout={handleLogout} />
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
        }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Hello, {navBarUser?.username || "user"}!</h1>
        <p className="text-lg text-gray-600 mb-10">
          Role: <span className="font-semibold">{navBarUser?.role}</span>
        </p>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md font-poppins z-10">
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
};

export default UserPage;