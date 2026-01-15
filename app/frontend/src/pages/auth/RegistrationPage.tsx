import { authApi } from "../../api_services/auth/AuthAPIService";
import { RegistrationForm } from "../../components/auth/RegistrationForm";
import { NavbarForm } from "../../components/navbar/NavBarForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen font-poppins flex flex-col">
      {/* NAVBAR */}
      <NavbarForm />

      {/* CONTENT */}
      <div
        className="flex-1 flex items-center justify-center pt-20"
        style={{
          background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
        }}
      >
        <RegistrationForm authApi={authApi} />
      </div>
    </div>
  )
}