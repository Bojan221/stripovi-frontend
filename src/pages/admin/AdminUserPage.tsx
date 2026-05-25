import { useState, useEffect } from "react";
import LoadingIndicator from "../../components/core/LoadingComponent";
import { axiosPrivate } from "../../api/axiosInstance";
import type { User } from "../../types/User";
import { showToast } from "../../utils/toast";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaRegUser, FaEdit, FaTrashAlt } from "react-icons/fa";
import UpdateUserPopup from "../../components/admin/UpdateUserPopup";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { AiOutlineStop } from "react-icons/ai";
import Avatar from "../../components/core/Avatar";
import { IoIosWarning } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

function AdminUserPage() {
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateUserId, setUpdateUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const currentUser = useSelector((state: RootState) => state.user.user);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get("/api/users/getAllUsers");
      setAllUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Greška pri učitavanju korisnika");
      showToast("error", err.response?.data?.message || "Greška pri učitavanju korisnika");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "moderator": return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
      default: return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  const getRoleIcon = (role: string) =>
    role === "admin" || role === "moderator" ? (
      <MdOutlineAdminPanelSettings size={13} className="inline mr-1" />
    ) : (
      <FaRegUser size={13} className="inline mr-1" />
    );

  const handleUpdateUser = (id: string) => {
    setShowUpdatePopup(true);
    setUpdateUserId(id);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await axiosPrivate.delete(`/api/users/deleteUser/${id}`);
      if (response.status === 200) showToast("success", "Korisnik je uspjesno obrisan");
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri brisanju korisnika");
    }
  };

  if (loading) return <LoadingIndicator placement="fullscreen" />;

  const filtered = allUsers?.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }) ?? [];

  const totalUsers = allUsers?.length ?? 0;
  const totalAdmins = allUsers?.filter((u) => u.role === "admin").length ?? 0;
  const totalMods = allUsers?.filter((u) => u.role === "moderator").length ?? 0;
  const totalRegular = totalUsers - totalAdmins - totalMods;

  return (
    <div className="p-6 md:p-8">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-0.5 bg-orange-500" />
        <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
          Korisnici sistema
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Ukupno", value: totalUsers, accent: "text-gray-950" },
          { label: "Admin", value: totalAdmins, accent: "text-red-500" },
          { label: "Moderatori", value: totalMods, accent: "text-orange-500" },
          { label: "Korisnici", value: totalRegular, accent: "text-gray-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-200"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretraži po imenu ili emailu..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <IoIosWarning className="w-5 h-5 text-orange-500 shrink-0" />
          <p className="text-red-700 font-semibold text-sm">{error}</p>
        </div>
      )}

      {filtered.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-950">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Korisnik</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Uloga</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user, idx) => (
                  <tr key={user.id || idx} className="hover:bg-orange-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar firstName={user.firstName} lastName={user.lastName} profilePicture={user.profilePicture} size="medium" />
                        <span className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {currentUser?.role === "moderator" && user.role === "admin" ? (
                        <div className="flex justify-center">
                          <AiOutlineStop size={16} className="text-red-400" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() => handleUpdateUser(user._id)}
                            className="p-2 rounded-lg hover:bg-orange-100 text-gray-400 hover:text-orange-500 transition-all cursor-pointer"
                          >
                            <FaEdit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                          >
                            <FaTrashAlt size={15} />
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
          <div className="md:hidden grid grid-cols-1 gap-3">
            {filtered.map((user, index) => (
              <div
                key={user.id || index}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar firstName={user.firstName} lastName={user.lastName} profilePicture={user.profilePicture} size="medium" />
                    <div>
                      <p className="font-black text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>

                {currentUser?.role === "moderator" && user.role === "admin" ? (
                  <div className="flex justify-center bg-red-50 border border-red-100 py-2.5 rounded-xl">
                    <AiOutlineStop size={16} className="text-red-400" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-500 hover:text-orange-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => handleUpdateUser(user._id)}
                    >
                      <FaEdit size={14} /> Uredi
                    </button>
                    <button
                      className="flex-1 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FaTrashAlt size={14} /> Obriši
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-300 text-5xl mb-4 font-black">—</p>
          <p className="text-gray-400 font-semibold">
            {search ? `Nema rezultata za "${search}"` : "Nema dostupnih korisnika"}
          </p>
        </div>
      )}

      {showUpdatePopup && updateUserId && (
        <UpdateUserPopup onClose={() => setShowUpdatePopup(false)} userId={updateUserId} fetch={fetchData} />
      )}
    </div>
  );
}

export default AdminUserPage;
