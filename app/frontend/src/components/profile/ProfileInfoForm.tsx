
interface UserInfo {
    username: string;
    role: "PLAYER" | "MODERATOR" | "ADMIN";
    avatarUrl?: string;
    onLogout: () => void;
}

export const ProfileInfoForm = ({ username, role, avatarUrl, onLogout }: UserInfo) => {
    return (
        <div className="flex items-center gap-3">
            {/* Avatar */}
            <img
                src={
                    avatarUrl ??
                    "https://ui-avatars.com/api/?name=User&background=82CAFF&color=fff"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
            />

            {/* Username + Role */}
            <div className="text-right leading-tight">
                <p className="text-sm font-semibold font-poppins">{username}</p>
                <p className="text-xs text-gray-500 font-poppins">{role}</p>
            </div>

            {/* Logout dugme */}
            <button
                onClick={onLogout}
                className="text-red-500 hover:text-red-600 transition text-xl"
                title="Logout"
            >
                {/* Logout ikonica (simple SVG) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                    />
                </svg>
            </button>
        </div>
    );
};
