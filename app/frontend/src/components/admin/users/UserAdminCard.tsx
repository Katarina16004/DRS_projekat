import { FaTrash } from "react-icons/fa";
import type { UserRole } from "../../../enums/user/UserRole";
import type { UserDTO } from "../../../models/users/UserDTO";
import { Info, capitalize } from "./UserHelpers";

interface UserAdminCardProps {
  user: UserDTO;
  onRoleChange: (id: number, role: UserRole) => void;
  onDelete: (id: number) => void;
  loggedInUserId?: number;
}

export const UserAdminCard = ({ user, onRoleChange, onDelete, loggedInUserId }: UserAdminCardProps) => {
  const isMe = user.ID_User === loggedInUserId;
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white border border-[#FFF8C6] shadow-xl rounded-2xl px-10 py-8 mb-8 transition hover:shadow-2xl">
      {/* Avatar */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#f3f3f3] border border-gray-300 mb-4 md:mb-0">
        {user.Image ? (
          <img src={user.Image} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <span className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-2xl">
            {(user.First_Name ?? "").charAt(0)}
            {(user.Last_Name ?? "").charAt(0)}
          </span>
        )}
      </div>
      {/* User Data */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-4 w-full ">
        <Info label="Name" value={user.First_Name ?? undefined} />
        <Info label="Surname" value={user.Last_Name ?? undefined} />
        <Info label="E-mail" value={user.Email ?? undefined} />
        <Info label="Gender" value={capitalize(user.Gender ?? undefined)} />
        <Info label="Date of birth" value={user.Birth_Date ?? undefined} />
        <Info label="Country" value={user.Country ?? undefined} />
        <Info label="Street" value={user.Street ?? undefined} />
        <Info label="Street Number" value={user.Street_Number ?? undefined} />
        <Info
          label="Role"
          value={
            user.role === "user" ? "User" :
            user.role === "moderator" ? "Moderator" :
            user.role === "admin" ? "Admin" :
            user.role
          }
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 ml-0 md:ml-4">
        {/* Role selector */}
        {user.role !== "admin" && (
        <select
          value={user.role}
          disabled={isMe}
          onChange={e =>
            onRoleChange(user.ID_User, e.target.value as UserRole)
          }
          className={`px-3 py-1 rounded-lg border text-sm font-medium
            ${isMe
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-[#82CAFF] text-[#4451A4] hover:border-[#4451A4] cursor-pointer"
            }`}
        >
          <option value="user">Player</option>
          <option value="moderator">Moderator</option>
        </select>
      )}

        {/* Delete */}
        {!isMe && (
          <button
            className="text-2xl text-red-400 hover:text-red-600 p-2 cursor-pointer rounded-full transition"
            onClick={() => onDelete(user.ID_User)}
            aria-label="Delete user"
            title="Delete user"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};