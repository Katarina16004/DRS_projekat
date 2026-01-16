import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { NavbarForm } from "../../components/navbar/NavBarForm";
import { UserAdminCard } from "../../components/admin/users/UserAdminCard";
import type { UserDTO } from "../../models/users/UserDTO";
import type { UserRole } from "../../enums/user/UserRole";
import { userApi } from "../../api_services/users/UserAPIService";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";


export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const token = localStorage.getItem("token");
  const [loggedInUserId, setLoggedInUserId] = useState<number | undefined>(undefined);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [navBarUser, setNavBarUser] = useState<{
    username: string;
    role: UserRole
  } | null>(null)

  useEffect(() => {
    //console.log("TOKEN:", token);
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      setLoggedInUserId(Number(decoded.id));

      setNavBarUser({
        username: decoded.username,
        role: decoded.role as UserRole
      })
    } catch (err) {
      setLoggedInUserId(undefined);
      setNavBarUser(null)
    }

    const fetchUsers = async () => {
      const data = await userApi.getAllUsers(token);
      setUsers(data);
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (id: number, role: UserRole) => {
    if (!token) return;

    const updatedUser = await userApi.changeUserRole(token, id, role);

    setUsers(prev =>
      prev.map(u => u.ID_User === id ? updatedUser : u)
    );
    toast.success("User role updated successfully");
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await userApi.deleteUser(token, id);
    setUsers(prev => prev.filter(u => u.ID_User !== id));
  };

  const handleDeleteAll = () => setUsers([]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen font-poppins flex flex-col">
      <NavbarForm user={navBarUser} onLogout={handleLogout} />
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
              onClick={() => setShowDeleteAllConfirm(true)}
            >
              <FaTrash /> Delete all
            </button>
          </div>
          {users.map(user =>
            <UserAdminCard
              key={user.ID_User}
              user={user}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
              loggedInUserId={loggedInUserId}
            />
          )}
        </div>
      </div>
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteAllConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md font-poppins z-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Delete all users?
            </h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to permanently delete all users?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowDeleteAllConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium"
                onClick={() => {
                  handleDeleteAll(); //odradicemo posle KT
                  setShowDeleteAllConfirm(false);
                }}
              >
                Delete all
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10 font-poppins">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Log out?
            </h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium"
                onClick={confirmLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}