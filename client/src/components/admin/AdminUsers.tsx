import SEO from "../../components/SEO";
import { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaUserShield,
  FaUser,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaFilter,
  FaUsers,
} from "react-icons/fa";
import useAuth from "../../context/auth/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isBlocked?: boolean;
  createdAt: string;
}

function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "admin" | "user" | "blocked"
  >("all");

  useEffect(() => {
    getAllUsersInfo();
  }, [token]);

  async function getAllUsersInfo() {
    try {
      if (!token) return;
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Connection error: can't get users list!");
      }
      const usersData = await response.json();
      setUsersList(usersData);
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsersList(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message || "Failed to delete user");
    }
  };

  const handleBlockUser = async (
    userId: string,
    currentBlockStatus: "active" | "blocked"
  ) => {
    const action = currentBlockStatus ? "unblock" : "block";

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus: currentBlockStatus === "active" ? "blocked" : "active" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      setUsersList(
        users.map((user) =>
          user._id === userId
            ? { ...user, isBlocked: !user.isBlocked }
            : user
        )
      );
      toast.success(`User ${action}ed successfully`);
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message || `Failed to ${action} user`);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery));

      const matchesFilter =
        filterType === "all" ||
        (filterType === "admin" && user.isAdmin) ||
        (filterType === "user" && !user.isAdmin) ||
        (filterType === "blocked" && user.isBlocked);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, filterType]);

  return (
    <div className="w-full py-6 sm:py-8">
      <SEO title="Manage Users" description="View and manage user accounts." />
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary-100 rounded-xl">
            <FaUsers className="text-primary-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
              User Management
            </h1>
            <p className="text-surface-500 text-sm">
              Manage and monitor all platform users
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-xl text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150"
              aria-label="Search users"
            />
          </div>

          <div className="flex gap-1.5 items-center flex-wrap">
            <FaFilter className="text-surface-400 w-4 h-4" />
            {(["all", "admin", "user", "blocked"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium motion-safe:transition-all motion-safe:duration-150 ${
                  filterType === type
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {type === "all" ? "All" : type === "admin" ? "Admins" : type === "user" ? "Users" : "Blocked"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 text-sm text-surface-500">
          Showing <span className="font-semibold text-surface-700">{filteredUsers.length}</span> of{" "}
          <span className="font-semibold text-surface-700">{users.length}</span> users
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-surface-500">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <FaUser className="mx-auto text-surface-300 text-4xl mb-3" />
            <p className="text-surface-600 text-base font-medium">
              No users found
            </p>
            <p className="text-surface-400 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Users table">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onDelete={handleDeleteUser}
                    onBlock={handleBlockUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface UserRowProps {
  user: User;
  onDelete: (userId: string) => void;
  onBlock: (userId: string, currentBlockStatus: "active" | "blocked") => void;
}

function UserRow({ user, onDelete, onBlock }: UserRowProps) {
  return (
    <tr className="hover:bg-surface-50 motion-safe:transition-colors motion-safe:duration-100">
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-surface-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-surface-400">
              ID: {user._id.slice(-8)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-sm text-surface-700">{user.email}</span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        {user.phone ? (
          <span className="text-sm text-surface-700">{user.phone}</span>
        ) : (
          <span className="text-sm text-surface-400">—</span>
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        {user.isAdmin ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <FaUserShield className="w-3 h-3" />
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
            <FaUser className="w-3 h-3" />
            User
          </span>
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        {user.isBlocked ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <FaBan className="w-3 h-3" />
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <FaCheckCircle className="w-3 h-3" />
            Active
          </span>
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-sm text-surface-600">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onBlock(user._id, user.isBlocked ? "blocked" : "active")}
            className={`p-2 rounded-lg motion-safe:transition-all motion-safe:duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              user.isBlocked
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:ring-emerald-500"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200 focus:ring-amber-500"
            }`}
            title={user.isBlocked ? "Unblock user" : "Block user"}
          >
            {user.isBlocked ? <FaCheckCircle className="w-4 h-4" /> : <FaBan className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 motion-safe:transition-all motion-safe:duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            title="Delete user"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AdminUsers;
