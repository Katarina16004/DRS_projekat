import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    username: string;
    email: string;
    name: string;
    surname: string;
    phone: string;
    address: string;
    country: string;
    birthDate: string;
    role: "PLAYER" | "MODERATOR" | "ADMIN";
    avatarUrl?: string;
}

export const ProfileInfoForm = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserProfile>({
        username: "admin",
        email: "admin@email.com",
        name: "Admin",
        surname: "User",
        phone: "+38164123456",
        address: "Main Street 10",
        country: "Serbia",
        birthDate: "1995-05-05",
        role: "ADMIN",
        avatarUrl: undefined,
    });

    const [isEditing, setIsEditing] = useState(false);

    // Menjanje polja forme
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Menjanje avatara
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setUser((prev) => ({ ...prev, avatarUrl: imageUrl }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-poppins bg-gradient-to-br from-[#C3FDB8] via-[#FFF8C6] to-[#BDEDFF] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 text-4xl font-bold"
                >
                    ←
                </button>

                {/* Header sa avatarom */}
                <div className="flex flex-col items-center mb-6">
                    <label htmlFor="avatarUpload" className="cursor-pointer">
                        <img
                            src={
                                user.avatarUrl ??
                                "https://ui-avatars.com/api/?name=User&background=82CAFF&color=fff"
                            }
                            className="w-32 h-32 rounded-full object-cover border mb-3 hover:opacity-90 transition"
                            alt="avatar"
                        />
                    </label>
                    <input
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <p className="text-lg font-semibold">
                        {user.name} {user.surname}
                    </p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                </div>

                {/* FORM u dve kolone */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <ProfileField label="Username" name="username" value={user.username} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Email" name="email" value={user.email} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Name" name="name" value={user.name} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Surname" name="surname" value={user.surname} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Phone" name="phone" value={user.phone} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Address" name="address" value={user.address} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Country" name="country" value={user.country} disabled={!isEditing} onChange={handleChange} />
                    <ProfileField label="Birth date" name="birthDate" type="date" value={user.birthDate} disabled={!isEditing} onChange={handleChange} />
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-[#54C571] hover:bg-[#3fa85a] text-white rounded-xl py-2 font-semibold font-poppins transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Edit profile
                        </button>
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