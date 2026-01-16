import { NavLink, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export const NavbarForm = ({ user, onLogout }: any) => {
    const location = useLocation();

    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/register";

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-1 text-base font-poppins transition ${isActive
            ? "underline underline-offset-4 font-semibold"
            : "hover:underline"
        }`;

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md px-8 flex items-center justify-between z-50">
            {/* LEVO */}
            <div className="text-xl font-bold font-poppins text-[#54C571]">
                Quizzzz
            </div>

            {/* SREDINA */}
            {!isAuthPage && user && (
                <div className="flex gap-6 text-gray-700">
                    {user.role === "ADMIN" && (
                        <>
                            <NavLink to="/adminUsers" className={navLinkClass}>
                                Users
                            </NavLink>
                            <NavLink to="/quizzes" className={navLinkClass}>
                                Quizzes
                            </NavLink>
                        </>
                    )}

                    {user.role === "MODERATOR" && (
                        <>
                            <NavLink to="/quizzes" className={navLinkClass}>
                                Quizzes
                            </NavLink>
                            <NavLink to="/my-quizzes" className={navLinkClass}>
                                My Quizzes
                            </NavLink>
                        </>
                    )}

                    {user.role === "PLAYER" && (
                        <NavLink to="/quizzes" className={navLinkClass}>
                            Quizzes
                        </NavLink>
                    )}
                </div>
            )}

            {/* DESNO */}
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        {/* Username + role */}
                        <div className="text-right leading-tight">
                            <div className="font-semibold text-gray-800 font-poppins">
                                {user.username}
                            </div>
                            <div className="text-xs text-gray-500 font-poppins">
                                {user.role}
                            </div>
                        </div>

                        {/* Avatar */}
                        <NavLink to="/update_profile" className="outline-none">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            ) : (
                                <FaUserCircle
                                    size={36}
                                    className="text-gray-400"
                                />
                            )}
                        </NavLink>

                        {/* Logout */}
                        <button
                            onClick={onLogout}
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
