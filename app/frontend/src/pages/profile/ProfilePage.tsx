import { useState } from "react";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { ProfileInfoForm } from "../../components/profile/ProfileInfoForm";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
    const token = localStorage.getItem("token")
    
    const user = token
  ? (() => {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        avatarUrl: decoded.avatarUrl ?? "",
      };
    })()
  : undefined;

    const navigate = useNavigate()
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    // Pravi logout
    const confirmLogout = () => {
        localStorage.removeItem("token");
        setShowLogoutModal(false);
        navigate("/login");
    };

    return (
        <div className="min-h-screen font-poppins flex flex-col">
            {/* NAVBAR */}
            <NavbarForm user={user} onLogout={handleLogout} />

            {/* CONTENT */}
            <div
                className="flex-1 flex items-center justify-center pt-16"
                style={{
                    background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
                }}
            >
                <ProfileInfoForm />
            </div>

            {/* LOGOUT MODAL */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Blur pozadine */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Log out
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to log out?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmLogout}
                                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
