import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { LoginForm } from "../../components/auth/LoginForm";
import { NavbarForm } from "../../components/navbar/NavBarForm";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function LoginPage({ authApi }: LoginPageProps) {
    return (
        <div className="min-h-screen font-poppins flex flex-col">
            {/* NAVBAR – fixed ili sticky */}
            <NavbarForm />

            {/* CONTENT */}
            <div
                className="flex-1 flex items-center justify-center"
                style={{
                    background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
                }}
            >
                <LoginForm authApi={authApi} />
            </div>
        </div>
    );
}
