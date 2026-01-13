import { NavbarForm } from "../../components/navbar/NavBarForm";
import { ProfileInfoForm } from "../../components/profile/ProfileInfoForm";

export default function ProfilePage() {
    // Primer korisnika koji je ulogovan
    const user = {
        username: "Bojana",
        role: "PLAYER" as const,
        avatarUrl: "", // može biti link ka slici ili prazan string za default avatar
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        // ovde ide tvoja logika za logout
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
                <ProfileInfoForm username={""} role={"PLAYER"} onLogout={function (): void {
                    throw new Error("Function not implemented.");
                } }   />
            </div>
        </div>
    );
}
