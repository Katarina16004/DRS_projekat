import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface LoginFormState {
    email: string;
    password: string;
}

interface ErrorState {
    [key: string]: string;
}

export const LoginForm = () => {
    const [form, setForm] = useState<LoginFormState>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<ErrorState>({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    function validate(form: LoginFormState): ErrorState {
        const newErrors: ErrorState = {};

        if (!form.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Email format is invalid.";
        }

        if (!form.password) {
            newErrors.password = "Password is required.";
        }

        return newErrors;
    }

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const validationErrors = validate(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // SIMULACIJA: Logovanje je uspešno SAMO za test@test.com / test123
            if (
                form.email === "test@test.com" &&
                form.password === "test123"
            ) {
                toast.success("Login successful!");
                navigate("/adminUsers");
            } else {
                //provera da li korisnik postoji
                toast.error("User does not exist!");
            }
        }
    };

    const errorClass =
        "block min-h-[1.05rem] text-xs font-poppins transition-colors";

    return (
        <div className="w-full max-w-md mx-auto rounded-3xl p-8 bg-white shadow-xl border border-[#FFF8C6] font-inter">
            <h2 className="text-3xl font-bold text-center mb-6 font-poppins tracking-wider">
                Login
            </h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">
                        E-mail:
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-transparent px-2 py-1 border-b-2 border-[#82CAFF] outline-none font-inter"
                        autoComplete="email"
                    />
                    <span
                        className={`${errorClass} ${submitted && errors.email ? "text-red-600" : "invisible"
                            }`}
                    >
                        {submitted && errors.email ? errors.email : "•"}
                    </span>
                </div>

                <div className="mb-6">
                    <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">
                        Password:
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full bg-transparent px-2 py-1 border-b-2 border-[#82CAFF] outline-none font-inter"
                        autoComplete="current-password"
                    />
                    <span
                        className={`${errorClass} ${submitted && errors.password ? "text-red-600" : "invisible"
                            }`}
                    >
                        {submitted && errors.password ? errors.password : "•"}
                    </span>
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
                <Link
                    to="/register"
                    className="text-[#82CAFF] hover:underline font-poppins"
                >
                    Register
                </Link>
            </p>
        </div>
    );
};