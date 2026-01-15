import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import type { AuthFormProps } from "../../types/props/auth/AuthFormProps";
import type { RegistrationData } from "../../models/auth/UserRegisterDTO";
import { validateRegistration, type RegistrationErrorState } from "../../api_services/validators/RegisterValidation";
//import { useAuth } from "../../hooks/auth/useAuthHook";

export const RegistrationForm = ({ authApi }: AuthFormProps) => {
  const [form, setForm] = useState<RegistrationData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    country: "",
    street: "",
    street_number: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<RegistrationErrorState>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    const validationErrors = validateRegistration(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const res = await authApi.register(form);

      const message = (res.message ?? res.error ?? "").toLowerCase();
      if (message.includes("success")) {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setServerError(res.message ?? res.error ?? "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setServerError("Server error. Please try again.");
    }
  };

  const errorClass = "block min-h-[1.05rem] text-xs font-poppins transition-colors";

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl p-8 bg-white shadow-xl border border-[#FFF8C6] font-inter">
      <h2 className="text-3xl font-bold text-center mb-4 font-poppins tracking-wider">
        Register
      </h2>

      {serverError && (
        <p className="text-center text-red-600 mb-4 font-poppins">
          {serverError}
        </p>
      )}

      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Username:</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#82CAFF] outline-none font-inter"
            autoComplete="username"
          />
          <span className={`${errorClass} ${submitted && errors.username ? "text-red-600" : "invisible"}`}>
            {submitted && errors.username ? errors.username : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#82CAFF] outline-none font-inter"
            autoComplete="new-password"
          />
          <span className={`${errorClass} ${submitted && errors.password ? "text-red-600" : "invisible"}`}>
            {submitted && errors.password ? errors.password : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Name:</label>
          <input
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#81cbf5] outline-none font-inter"
          />
          <span className={`${errorClass} ${submitted && errors.first_name ? "text-red-600" : "invisible"}`}>
            {submitted && errors.first_name ? errors.first_name : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Surname:</label>
          <input
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#81cbf5] outline-none font-inter"
          />
          <span className={`${errorClass} ${submitted && errors.last_name ? "text-red-600" : "invisible"}`}>
            {submitted && errors.last_name ? errors.last_name : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Date of birth:</label>
          <input
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#54C571] outline-none font-inter cursor-pointer"
          />
          <span className={`${errorClass} ${submitted && errors.birth_date ? "text-red-600" : "invisible"}`}>
            {submitted && errors.birth_date ? errors.birth_date : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Gender:</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#54C571] outline-none font-inter cursor-pointer"
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <span className={`${errorClass} ${submitted && errors.gender ? "text-red-600" : "invisible"}`}>
            {submitted && errors.gender ? errors.gender : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">E-mail:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#D462FF] outline-none font-inter"
            autoComplete="email"
          />
          <span className={`${errorClass} ${submitted && errors.email ? "text-red-600" : "invisible"}`}>
            {submitted && errors.email ? errors.email : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Country:</label>
          <input
            name="country"
            type="text"
            value={form.country}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#D462FF] outline-none font-inter"
          />
          <span className={`${errorClass} ${submitted && errors.country ? "text-red-600" : "invisible"}`}>
            {submitted && errors.country ? errors.country : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Street:</label>
          <input
            name="street"
            type="text"
            value={form.street}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#D462FF] outline-none font-inter"
          />
          <span className={`${errorClass} ${submitted && errors.street ? "text-red-600" : "invisible"}`}>
            {submitted && errors.street ? errors.street : "•"}
          </span>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1 font-poppins">Number:</label>
          <input
            name="street_number"
            type="text"
            value={form.street_number}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1 border-b-2 border-[#D462FF] outline-none font-inter"
          />
          <span className={`${errorClass} ${submitted && errors.street_number ? "text-red-600" : "invisible"}`}>
            {submitted && errors.street_number ? errors.street_number : "•"}
          </span>
        </div>
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-[#54C571] hover:bg-[#82CAFF] text-white rounded-xl py-2 font-semibold font-poppins transition cursor-pointer"
          >
            Register
          </button>
        </div>
      </form>
      <p className="text-center text-gray-700 text-xs mt-3 font-poppins">
        Already have an account?{" "}
        <Link to="/login" className="text-[#82CAFF] hover:underline font-poppins">Login</Link>
      </p>
    </div>
  );
};