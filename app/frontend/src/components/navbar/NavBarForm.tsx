import { NavLink, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { UserRole } from "../../enums/user/UserRole";

export const NavbarForm = ({ user, onLogout }: any) => {
    const location = useLocation();
    const token = localStorage.getItem("token")
    const [navBarUser, setNavBarUser] = useState<{
        username: string
        role: UserRole
        Image: string
    } | null>(null)


    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/register";

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-1 text-base font-poppins transition ${isActive
            ? "underline underline-offset-4 font-semibold"
            : "hover:underline"
        }`;

    useEffect(() => {
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.id;


        } catch {
            setNavBarUser({
                username: "",
                role: "user",
                Image: "",
            });
        }
    }, [token]);

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md px-8 flex items-center justify-between z-50">
            {/* LEVO */}
            <div className="text-xl font-bold font-poppins text-[#54C571]">
                Quizzzz
            </div>

            {/* SREDINA */}
            {!isAuthPage && user && (
                <div className="flex gap-6 text-gray-700">
                    {user.role === "admin" && (
                        <>
                            <NavLink to="/adminUsers" className={navLinkClass}>
                                Users
                            </NavLink>
                            <NavLink to="/admin/quizzes" className={navLinkClass}>
                                Quizzes
                            </NavLink>
                        </>
                    )}

                    {user.role === "moderator" && (
                        <>
                            <NavLink to="/user" className={navLinkClass}>
                                Quizzes
                            </NavLink>
                            <NavLink to="/moderator/quizzes" className={navLinkClass}>
                                My Quizzes
                            </NavLink>
                        </>
                    )}


                    {user.role === "user" && (
                        <NavLink to="/user" className={navLinkClass}>
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
                        <NavLink to="/profileInfo" className="outline-none">
                            {navBarUser?.Image ? (
                                <img
                                    key={navBarUser.Image}
                                    src={navBarUser.Image}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            ) : (
                                <FaUserCircle size={36} className="text-gray-400" />
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
