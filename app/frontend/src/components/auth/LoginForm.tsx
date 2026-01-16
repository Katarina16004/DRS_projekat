import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; 
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import type { LoginData } from "../../models/auth/UserLoginDTO";
import { validateLogin, type LoginErrorState } from "../../api_services/validators/LoginValidation";

export function LoginForm({ authApi }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(""); 
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<LoginErrorState>({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const sendForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const loginData: LoginData = { email, password };
        const validationErrors = validateLogin(loginData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        try {
            const res = await authApi.login(loginData);

            if (res.token) {
                login(res.token);
                localStorage.setItem("token", res.token);
                toast.success("Login successful!");

                const claims = jwtDecode<JwtTokenClaims>(res.token);
                const role = claims.role;

                if (role === "admin") {
                    navigate("/adminUsers");
                } else if (role === "user" || role === "moderator") {
                    navigate("/user");
                }

            } else {
                setErr(res.error ?? res.message ?? "Login failed");
                setEmail("");
                setPassword("");
            }
        } catch (error) {
            setErr("Login failed. Please try again.");
        }
    };

    const errorClass = "block min-h-[1.05rem] text-xs font-poppins transition-colors text-red-600";

    return (
        <div className="w-full max-w-md mx-auto rounded-3xl p-8 bg-white shadow-xl border border-[#FFF8C6] font-inter mt-16">
            <h2 className="text-3xl font-bold text-center mb-6 font-poppins tracking-wider text-[#4451A4]">
                Login
            </h2>

            {err && <p className="text-center text-red-600 mb-4">{err}</p>}

            <form onSubmit={sendForm} noValidate>
                {/* Email */}
                <div className="mb-4">
                    <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">
                        E-mail:
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent px-2 py-1 border-b-2 border-[#82CAFF] outline-none font-inter"
                        autoComplete="email"
                    />
                    {submitted && errors.email && <span className={errorClass}>{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="mb-6 relative">
                    <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">
                        Password:
                    </label>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent px-2 py-1 border-b-2 border-[#82CAFF] outline-none font-inter pr-10"
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-[#4451A4] hover:text-[#2b2b7a]"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                    {submitted && errors.password && <span className={errorClass}>{errors.password}</span>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#54C571] hover:bg-[#82CAFF] text-white rounded-xl py-2 font-semibold font-poppins transition cursor-pointer"
                >
                    Login
                </button>
            </form>

            <p className="text-center text-gray-700 text-xs mt-4 font-poppins">
                Don’t have an account?{" "}
                <Link to="/register" className="text-[#82CAFF] hover:underline font-poppins">
                    Register
                </Link>
            </p>
        </div>
    );
}