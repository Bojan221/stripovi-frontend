import { useState, useEffect } from "react";
import LoadingIndicator from "../../components/core/LoadingComponent";
import { axiosPrivate } from "../../api/axiosInstance";
import type { User } from "../../types/User";
import { showToast } from "../../utils/toast";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaRegUser, FaEdit, FaTrashAlt } from "react-icons/fa";
import UpdateUserPopup from "../../components/UpdateUserPopup";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { AiOutlineStop } from "react-icons/ai";

function AdminUserPage() {
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateUserId, setUpdateUserId] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get("/api/users/getAllUsers");
      setAllUsers(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Greška pri učitavanju korisnika",
      );
      showToast("error", err.response.data.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getRoleIcon = (role: string) => {
    return role === "admin" || role === "moderator" ? (
      <MdOutlineAdminPanelSettings size={16} className="inline mr-1" />
    ) : (
      <FaRegUser size={16} className="inline mr-1" />
    );
  };

  const handleUpdateUser = (id: string) => {
    setShowUpdatePopup(true);
    setUpdateUserId(id);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await axiosPrivate.delete(`/api/users/deleteUser/${id}`);
      if (response.status === 200) {
        showToast("success", "Korisnik je uspjesno obrisan");
      }
      fetchData();
    } catch (err) {
      console.log(err);
      showToast("error", "Greška pri brisanju korisnika");
    }
  };

  if (loading) {
    return <LoadingIndicator placement="fullscreen" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100 py-8 px-4 md:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border-l-4 border-blue-600">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ADMIN PANEL
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Upravljanje korisnicima sistema
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold opacity-90">
                Ukupno korisnika
              </p>
              <p className="text-2xl font-bold mt-1">{allUsers?.length || 0}</p>
            </div>
            <div className="bg-linear-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold opacity-90">Admin</p>
              <p className="text-2xl font-bold mt-1">
                {allUsers?.filter((u) => u.role === "admin").length || 0}
              </p>
            </div>
            <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p className="text-sm font-semibold opacity-90">Moderatori</p>
              <p className="text-2xl font-bold mt-1">
                {allUsers?.filter((u) => u.role === "moderator").length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table / Cards */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {allUsers && allUsers.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Ime i prezime
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Uloga
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Akcije
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user, idx) => (
                    <tr
                      key={user.id || idx}
                      className={`border-b border-slate-200 hover:bg-blue-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
                            user.role,
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center ">
                        {currentUser?.role === "moderator" &&
                        user.role === "admin" ? (
                          <div className="flex justify-center items-center">
                            <AiOutlineStop size={16} color="red" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-center ">
                            <button
                              className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors cursor-pointer"
                              onClick={() => handleUpdateUser(user._id)}
                            >
                              <FaEdit size={16} color="orange" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors cursor-pointer"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <FaTrashAlt size={16} color="red" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {allUsers.map((user, index) => (
                <div
                  key={user.id || index}
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                        user.role,
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div>
                    {currentUser?.role === "moderator" &&
                    user.role === "admin" ? (
                      <div className="flex justify-center bg-red-500 py-2 rounded-md">
                        <AiOutlineStop size={16} color="white" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center"
                          onClick={() => handleUpdateUser(user._id)}
                        >
                          <FaEdit size={16} color="white" />
                        </button>
                        <button
                          className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FaTrashAlt size={16} color="white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Nema dostupnih korisnika</p>
          </div>
        )}
      </div>
      {showUpdatePopup && updateUserId && (
        <UpdateUserPopup
          onClose={() => setShowUpdatePopup(false)}
          userId={updateUserId}
          fetch={() => fetchData()}
        />
      )}
    </div>
  );
}

export default AdminUserPage;
