import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode} from "jwt-decode";
import { userApi } from "../../api_services/users/UserAPIService";
import type { UserDTO } from "../../models/users/UserDTO";
import toast from "react-hot-toast";

interface ProfileFieldProps {
  label: string;
  name: string;
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  name,
  value,
  disabled,
  onChange,
  type = "text",
}) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-xs mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={`border rounded-lg px-3 py-2 text-sm ${
        disabled ? "bg-gray-100 text-gray-600" : "bg-white"
      }`}
    />
  </div>
);

export const ProfileInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const [dto, setDto] = useState<UserDTO | null>(null);
  const [formUser, setFormUser] = useState<UserDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    let userId = null;
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id;
    } catch {
      return;
    }
    if (!userId) return;
    userApi.getProfile(token, userId).then((profile) => {
      setDto(profile);
      setFormUser(profile);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formUser) return;
    setFormUser({ ...formUser, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFormUser(dto);
    setErrorMsg(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !formUser) return;
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await userApi.updateProfile(token, formUser.ID_User, formUser); 
      setIsEditing(false);
      setDto(formUser); 
      toast.success("Profile data saved successfully.");
    } catch (err: any) {
      setErrorMsg("Error saving profile data!");
      toast.error("Failed to save profile data.");
    }
    setIsSaving(false);
  };

  const avatarUrl =
    formUser?.Image && formUser.Image !== ""
      ? formUser.Image
      : "https://ui-avatars.com/api/?name=User&background=82CAFF&color=fff";

  if (!formUser || !dto) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 text-4xl font-bold cursor-pointer"
        >
          ←
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarUrl}
            className="w-32 h-32 rounded-full object-cover border mb-3 hover:opacity-90 transition"
            alt="avatar"
          />
          {isEditing && (
            <ProfileField
              label="Avatar URL"
              name="Image"
              value={formUser.Image ?? ""}
              disabled={false}
              onChange={handleChange}
            />
          )}
          <p className="text-lg font-semibold">
            {(formUser.First_Name ?? "") + " " + (formUser.Last_Name ?? "")}
          </p>
          <p className="text-sm text-gray-500">{formUser.role}</p>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <ProfileField
            label="E-mail"
            name="Email"
            value={formUser.Email ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Name"
            name="First_Name"
            value={formUser.First_Name ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Surname"
            name="Last_Name"
            value={formUser.Last_Name ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Date of birth"
            name="Birth_Date"
            type="date"
            value={formUser.Birth_Date ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Country"
            name="Country"
            value={formUser.Country ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Street"
            name="Street"
            value={formUser.Street ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Street Number"
            name="Street_Number"
            value={formUser.Street_Number ?? ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
          {/* Gender field */}
            <div className="flex flex-col">
            <label className="text-gray-500 text-xs mb-1">Gender</label>
            {!isEditing ? (
                <input
                type="text"
                name="Gender"
                value={formUser.Gender ?? ""}
                disabled
                className="border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600"
                />
            ) : (
                <select
            name="Gender"
            value={formUser.Gender ?? ""}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
            >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            </select>
            )}
            </div>
        </div>

        {errorMsg && (
          <div className="text-red-500 text-sm text-center mt-4">{errorMsg}</div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex-1 bg-[#54C571] cursor-pointer hover:bg-[#3fa85a] text-white rounded-xl py-2 font-semibold font-poppins transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Edit profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-[#54C571] cursor-pointer hover:bg-[#3fa85a] text-white rounded-xl py-2 font-semibold font-poppins transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 border rounded-lg py-2 cursor-pointer"
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