import { NavLink } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

interface NavbarProps {
    user?: {
        username: string;
        role: "PLAYER" | "MODERATOR" | "ADMIN";
        avatarUrl?: string;
    };
    onLogout?: () => void;
}

export const NavbarForm = ({ user, onLogout }: NavbarProps) => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-1 text-base font-poppins transition ${isActive ? "underline underline-offset-4 font-semibold" : "hover:underline"
        }`;

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md px-8 flex items-center justify-between z-50">
            {/* LEVO - Logo */}
            <div className="text-xl font-bold font-poppins text-[#54C571]">
                QuizVerse
            </div>

            {/* CENTAR - Navigacija */}
            <div className="flex gap-6 text-gray-700">
                <NavLink to="/dashboard" className={navLinkClass}>
                    Home
                </NavLink>
                <NavLink to="/quizzes" className={navLinkClass}>
                    Quizzes
                </NavLink>
                <NavLink to="/leaderboard" className={navLinkClass}>
                    Leaderboard
                </NavLink>
            </div>

            {/* DESNO - Profil */}
            <div>
                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Tekstualni deo: username + role */}
                        <div className="text-right">
                            <div className="font-semibold text-gray-800 font-poppins">{user.username}</div>
                            <div className="text-xs text-gray-500 font-poppins">{user.role}</div>
                        </div>

                        {/* Avatar ikonica */}
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                        ) : (
                            <FaUserCircle size={36} className="text-gray-400" />
                        )}

                        {/* Logout ikonica */}
                        <button
                            onClick={onLogout ?? (() => console.log("logout"))}
                            className="text-red-500 hover:text-red-600 transition"
                        >
                            <FaSignOutAlt size={22} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <NavLink to="/login" className="hover:underline">
                            Login
                        </NavLink>
                        <NavLink to="/register" className="hover:underline">
                            Register
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};
