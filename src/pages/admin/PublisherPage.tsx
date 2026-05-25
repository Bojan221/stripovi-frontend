import { useState, useEffect } from "react";
import CreatePublisherPopup from "../../components/admin/CreatePublisherPopup";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import type { Publisher } from "../../types/Publisher";
import LoadingIndicator from "../../components/core/LoadingComponent";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "../../components/core/Avatar";
import { MdLocalLibrary } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

function PublisherPage() {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatePublisher, setUpdatePublisher] = useState<Publisher | null>(null);
  const [search, setSearch] = useState("");

  const fetchPublishers = async () => {
    try {
      const res = await axiosPrivate.get("/api/publishers/getAllPublishers");
      setPublishers(res.data);
      setLoading(false);
    } catch (err: any) {
      showToast("error", err.resposnse?.data?.message || "Greška pri učitavanju");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/api/publishers/deletePublisher/${id}`);
      showToast("success", "Uspješno obrisan izdavač");
      fetchPublishers();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri brisanju");
    }
  };

  if (loading) return <LoadingIndicator placement="fullscreen" size="lg" />;

  const filtered = publishers?.filter((p) => {
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.country?.toLowerCase().includes(q);
  }) ?? [];

  return (
    <div className="p-6 md:p-8">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-0.5 bg-orange-500" />
        <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
          Izdavači sistema
        </span>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black text-gray-950">
          Svi <span className="text-orange-500">Izdavači</span>
        </h2>
        <button
          className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 active:scale-95 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
          onClick={() => setShowCreatePopup(true)}
        >
          <MdLocalLibrary size={16} />
          Dodaj Izdavača
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretraži po nazivu ili državi..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
        />
      </div>

      {filtered.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-950">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Izdavač</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Država</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreirao</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreiran u</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-white/50">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((publisher: Publisher) => (
                  <tr key={publisher._id} className="hover:bg-orange-50/50 transition-colors group">
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">{publisher.name}</td>
                    <td className="px-6 py-4 text-center text-gray-400 text-sm font-semibold">{publisher.country}</td>
                    <td className="px-6 py-4 text-center">
                      {publisher.createdBy ? (
                        <div className="flex items-center justify-center gap-2">
                          <Avatar
                            firstName={publisher.createdBy?.firstName || ""}
                            lastName={publisher.createdBy?.lastName || ""}
                            profilePicture={publisher.createdBy?.profilePicture || ""}
                            size="xs"
                          />
                          <span className="text-sm font-bold text-gray-900">
                            {publisher.createdBy?.firstName} {publisher.createdBy?.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Nepoznat</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400 text-sm">
                      {format(new Date(publisher.createdAt), "dd-MM-yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 items-center justify-end">
                        <button
                          className="p-2 rounded-lg hover:bg-orange-100 text-gray-400 hover:text-orange-500 transition-all cursor-pointer"
                          title="Uredi izdavača"
                          onClick={() => { setShowCreatePopup(true); setUpdatePublisher(publisher); }}
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                          title="Obriši izdavača"
                          onClick={() => handleDelete(publisher._id)}
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {filtered.map((publisher: Publisher) => (
              <div
                key={publisher._id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-lg font-black text-gray-950">{publisher.name}</p>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-0.5">
                      {publisher.country}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold">
                    {format(new Date(publisher.createdAt), "dd.MM.yyyy")}
                  </p>
                </div>

                {publisher.createdBy && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl border border-gray-100">
                    <Avatar
                      firstName={publisher.createdBy?.firstName || ""}
                      lastName={publisher.createdBy?.lastName || ""}
                      profilePicture={publisher.createdBy?.profilePicture || ""}
                      size="xs"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {publisher.createdBy?.firstName} {publisher.createdBy?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{publisher.createdBy?.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-500 hover:text-orange-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => { setShowCreatePopup(true); setUpdatePublisher(publisher); }}
                  >
                    <FaEdit size={14} /> Uredi
                  </button>
                  <button
                    className="flex-1 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => handleDelete(publisher._id)}
                  >
                    <FaTrashAlt size={14} /> Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-300 text-5xl mb-4 font-black">—</p>
          <p className="text-gray-400 font-semibold">
            {search ? `Nema rezultata za "${search}"` : "Nema dostupnih izdavača"}
          </p>
        </div>
      )}

      {showCreatePopup && (
        <CreatePublisherPopup
          onClose={() => { setShowCreatePopup(false); setUpdatePublisher(null); }}
          fetch={fetchPublishers}
          {...(updatePublisher && { updateData: updatePublisher, update: true })}
        />
      )}
    </div>
  );
}

export default PublisherPage;
