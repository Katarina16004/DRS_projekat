import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    country: string;
    birthDate: string;
    role: "PLAYER" | "MODERATOR" | "ADMIN";
    avatarUrl?: string;
}

export const ProfileInfoForm = () => {
    const navigate = useNavigate();

    // MOCK USER (kasnije iz auth-a)
    const [user, setUser] = useState<UserProfile>({
        username: "admin",
        email: "admin@email.com",
        fullName: "Admin User",
        phone: "+38164123456",
        address: "Main Street 10",
        country: "Serbia",
        birthDate: "1995-05-05",
        role: "ADMIN",
        avatarUrl: undefined,
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-poppins bg-gradient-to-br from-[#C3FDB8] via-[#FFF8C6] to-[#BDEDFF]">
            <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 relative">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-3 left-3 text-gray-400 hover:text-gray-600"
                >
                    ←
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center">
                    <img
                        src={
                            user.avatarUrl ??
                            "https://ui-avatars.com/api/?name=User&background=82CAFF&color=fff"
                        }
                        className="w-24 h-24 rounded-full object-cover border mb-3 cursor-pointer"
                    />
                    <p className="text-lg font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                </div>

                {/* FORM */}
                <div className="mt-5 space-y-3 text-sm">
                    <ProfileField label="Username" name="username" value={user.username} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Email" name="email" value={user.email} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Full name" name="fullName" value={user.fullName} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Phone" name="phone" value={user.phone} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Address" name="address" value={user.address} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Country" name="country" value={user.country} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Birth date" name="birthDate" type="date" value={user.birthDate} disabled={!isEditing} onChange={handleChange} />
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 bg-[#54C571] hover:bg-[#3fa85a] text-white rounded-xl py-2 font-semibold font-poppins transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"

                            >
                                Edit profile
                            </button>
                            <button
                                className="flex-1 border border-red-500 text-red-500 rounded-lg py-2 hover:bg-red-50"
                                onClick={() => alert("Delete profile")}
                            >
                                Delete profile
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-[#54C571] hover:bg-[#3fa85a] text-white rounded-xl py-2 font-semibold font-poppins transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"

                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 border rounded-lg py-2"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/* HELPER */
const ProfileField = ({
    label,
    name,
    value,
    disabled,
    onChange,
    type = "text",
}: any) => (
    <div className="flex flex-col">
        <label className="text-gray-500 text-xs mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            disabled={disabled}
            onChange={onChange}
            className={`border rounded-lg px-3 py-2 text-sm ${disabled ? "bg-gray-100 text-gray-600" : "bg-white"
                }`}
        />
    </div>
);
