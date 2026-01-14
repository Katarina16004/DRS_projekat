import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { UserAdminCard } from "../../components/admin/users/UserAdminCard";
import type { UserDTO } from "../../models/users/UserDTO";
import type { UserRole } from "../../enums/user/UserRole";

// Dummy admin korisnik za prikaz na Navbar-u
const adminNavbarUser = {
  username: "admin",
  role: "ADMIN" as UserRole,
  // avatarUrl: "https://i.pravatar.cc/150?u=admin", // ili undefined bez slike
};

// Demo korisnici
const initialUsers: UserDTO[] = [
  { id: 1, name: "John", surname: "Doe", username: "jdoe", role: "PLAYER", avatarUrl: undefined, date_of_birth: '1990-01-01', gender: "male", email: 'jdoe@email.com', country: 'USA', street: 'Main', number: '101' },
  { id: 2, name: "Jane", surname: "Smith", username: "jsmith", role: "MODERATOR", avatarUrl: undefined, date_of_birth: '1992-02-14', gender: "female", email: 'jsmith@email.com', country: 'UK', street: 'King', number: '33' },
  { id: 3, name: "Alex", surname: "Johnson", username: "ajohnson", role: "PLAYER", avatarUrl: undefined, date_of_birth: '1993-03-23', gender: "other", email: 'alexj@email.com', country: 'Canada', street: 'Oak', number: '22B' },
  { id: 4, name: "Emily", surname: "Williams", username: "ewilliams", role: "ADMIN", avatarUrl: undefined, date_of_birth: '1995-05-05', gender: "female", email: 'emilyw@email.com', country: 'Australia', street: 'Pine', number: '12' },
  { id: 5, name: "Michael", surname: "Brown", username: "mbrown", role: "PLAYER", avatarUrl: undefined, date_of_birth: '1988-07-08', gender: "male", email: 'mbrown@email.com', country: 'USA', street: 'Elm', number: '402' },
  { id: 6, name: "Sophia", surname: "Davis", username: "sdavis", role: "MODERATOR", avatarUrl: undefined, date_of_birth: '1996-08-19', gender: "female", email: 'sophiad@email.com', country: 'Germany', street: 'Linden', number: '5' },
  { id: 7, name: "Liam", surname: "Martinez", username: "lmartinez", role: "PLAYER", avatarUrl: undefined, date_of_birth: '1991-11-11', gender: "male", email: 'liam@email.com', country: 'Spain', street: 'Calle Real', number: '17' },
  { id: 8, name: "Olivia", surname: "Garcia", username: "ogarcia", role: "ADMIN", avatarUrl: undefined, date_of_birth: '1994-12-25', gender: "female", email: 'oliviag@email.com', country: 'France', street: 'Rue de Paris', number: '8' },
  { id: 9, name: "Noah", surname: "Lee", username: "nlee", role: "PLAYER", avatarUrl: undefined, date_of_birth: '1987-04-16', gender: "male", email: 'noahl@email.com', country: 'South Korea', street: 'Gangnam-daero', number: '110' },
  { id: 10, name: "Emma", surname: "Gonzalez", username: "egonzalez", role: "PLAYER", avatarUrl: undefined, date_of_birth: '1998-09-10', gender: "female", email: 'emmag@email.com', country: 'Mexico', street: 'Juarez', number: '404' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>(initialUsers);

  const handleRoleChange = (id: string | number, role: UserRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleDelete = (id: string | number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleDeleteAll = () => setUsers([]);

  // Primer funkcije za logout
  const handleLogout = () => {
    // Ovdje možeš obrisati token, obaviti redirect itd.
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen font-poppins flex flex-col">
      {/* NAVBAR prikazuje profil, rolu i logout */}
      <NavbarForm user={adminNavbarUser} onLogout={handleLogout} />
      {/* CONTENT */}
      <div
        className="flex-1 w-full pb-16"
        style={{
          background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
        }}
      >
        <div className="flex flex-col items-center pt-20 pb-2 w-full">
          <div className="flex w-full max-w-6xl justify-between items-center mb-8 px-4">
            <h2 className="text-3xl font-bold font-poppins tracking-wider text-gray-800">Users</h2>
            <button
              className="flex items-center gap-2 text-red-500 hover:text-red-700 transition px-4 py-2 font-medium bg-red-50 border cursor-pointer border-red-200 rounded-xl"
              onClick={handleDeleteAll}
            >
              <FaTrash /> Delete all
            </button>
          </div>
          {/* SVE ŠIROKE KARTICE */}
          {users.map(user =>
            <UserAdminCard
              key={user.id}
              user={user}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}