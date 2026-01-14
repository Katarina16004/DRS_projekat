import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { UserRole } from "../../../enums/user/UserRole";
import type { UserDTO } from "../../../models/users/UserDTO";
import { Info, capitalize } from "./UserHelpers";

interface UserAdminCardProps {
  user: UserDTO;
  onRoleChange: (id: string | number, role: UserRole) => void;
  onDelete: (id: string | number) => void;
}

export const UserAdminCard = ({ user, onRoleChange, onDelete }: UserAdminCardProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white border border-[#FFF8C6] shadow-xl rounded-2xl px-10 py-8 mb-8 transition hover:shadow-2xl">
      {/* Avatar */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#f3f3f3] border border-gray-300 mb-4 md:mb-0">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <span className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-2xl">
            {user.name?.charAt(0)}{user.surname?.charAt(0)}
          </span>
        )}
      </div>
      {/* User Data */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 w-full">
        <Info label="Name" value={user.name} />
        <Info label="Surname" value={user.surname} />
        <Info label="Username" value={user.username} />
        <Info label="E-mail" value={user.email} />
        <Info label="Gender" value={capitalize(user.gender)} />
        <Info label="Date of birth" value={user.date_of_birth} />
        <Info label="Country" value={user.country} />
        <Info label="Street" value={user.street} />
        <Info label="Number" value={user.number} />
        <div className="flex flex-col mb-2">
          <span className="font-medium text-xs text-gray-600 mb-1">Role</span>
          <select
            className="py-1 px-2 rounded-lg border border-gray-300 font-medium cursor-pointer bg-[#f9f9f9] focus:bg-white shadow-sm transition"
            value={user.role}
            onChange={e => onRoleChange(user.id, e.target.value as UserRole)}
          >
            <option value="PLAYER">Player</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {/* Dugme za kvizove samo za moderatora */}
        {user.role === "MODERATOR" && (
          <div className="flex flex-col mb-2 justify-end">
            <span className="font-medium text-xs text-gray-600 mb-1 invisible">Quizzes</span>
            <Link
              to={`/users/${user.id}/quizzes`}
              className="inline-block px-4 py-2 bg-[#82CAFF] hover:bg-[#54C571] text-white font-semibold rounded-lg shadow text-center transition"
            >
              Quizzes
            </Link>
          </div>
        )}
      </div>
      {/* Delete */}
      <button
        className="ml-0 md:ml-4 mt-8 md:mt-0 text-2xl text-red-400 hover:text-red-600 p-2 cursor-pointer rounded-full transition"
        onClick={() => onDelete(user.id)}
        aria-label="Delete user"
        title="Delete user"
      >
        <FaTrash />
      </button>
    </div>
  );
};