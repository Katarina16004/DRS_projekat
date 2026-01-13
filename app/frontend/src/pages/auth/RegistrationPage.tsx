import React from "react";
import { RegistrationForm } from "../../components/auth/RegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center font-poppins"
    style={{
        background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
      }}>
      <RegistrationForm />
    </div>
  );
}