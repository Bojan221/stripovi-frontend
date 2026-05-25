import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "../core/Avatar";
import { showToast } from "../../utils/toast";
import { axiosPrivate } from "../../api/axiosInstance";
import type { Edition } from "../../types/Edition";
import CreateEditionPopup from "./CreateEditionPopup";
import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import { IoClose } from "react-icons/io5";

interface EditionsTableProps {
  editions: Edition[];
  onRefresh?: () => void;
  publishers?: Publisher[];
  heroes?: Hero[];
}

interface HeroModalState {
  isOpen: boolean;
  heroes: Array<{ _id: string; name: string }>;
}

function EditionsTable({ editions, onRefresh, publishers, heroes }: EditionsTableProps) {
  const [heroModal, setHeroModal] = useState<HeroModalState>({ isOpen: false, heroes: [] });
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateData, setUpdateData] = useState<{
    edition?: string;
    heroesIds?: string[];
    publisher?: string;
    editionId?: string;
  }>({});

  const openHeroModal = (heroes: Array<{ _id: string; name: string }>) => {
    setHeroModal({ isOpen: true, heroes });
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/api/editions/deleteEdition/${id}`);
      showToast("success", "Uspješno obrisana edicija");
      onRefresh?.();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri brisanju");
    }
  };

  const openEdit = (edition: Edition) => {
    const heroesIds = edition.heroes?.map((h: any) => h._id) || [];
    setUpdateData({
      edition: edition.name,
      publisher: edition.publisher._id,
      heroesIds,
      editionId: edition._id,
    });
    setShowUpdatePopup(true);
  };

  if (!editions || editions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-300 text-5xl mb-4 font-black">—</p>
        <p className="text-gray-400 font-semibold">Nema dostupnih edicija</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-950">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Naziv</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Izdavač</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Junaci</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreirao</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreirano</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-white/50">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {editions.map((edition: Edition) => (
              <tr key={edition._id} className="hover:bg-orange-50/50 transition-colors group">
                <td className="px-6 py-4 font-black text-gray-900 text-sm">{edition.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                    {edition.publisher.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {edition.heroes?.length === 1 ? (
                    <span className="inline-block bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                      {edition.heroes[0].name}
                    </span>
                  ) : (
                    <button
                      onClick={() => openHeroModal(edition.heroes)}
                      className="inline-block bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-orange-100 transition-colors cursor-pointer"
                    >
                      {edition.heroes?.length} junaka
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {edition.createdBy ? (
                    <div className="flex items-center justify-center gap-2">
                      <Avatar
                        firstName={edition.createdBy?.firstName || ""}
                        lastName={edition.createdBy?.lastName || ""}
                        profilePicture={edition.createdBy?.profilePicture || ""}
                        size="xs"
                      />
                      <span className="text-sm font-bold text-gray-900">
                        {edition.createdBy?.firstName} {edition.createdBy?.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Nepoznat</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-gray-400 text-sm">
                  {format(new Date(edition.createdAt), "dd.MM.yyyy HH:mm")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-1 items-center justify-end">
                    <button
                      className="p-2 rounded-lg hover:bg-orange-100 text-gray-400 hover:text-orange-500 transition-all cursor-pointer"
                      title="Uredi ediciju"
                      onClick={() => openEdit(edition)}
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Obriši ediciju"
                      onClick={() => handleDelete(edition._id)}
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
        {editions.map((edition: Edition) => (
          <div
            key={edition._id}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-lg font-black text-gray-950">{edition.name}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {edition.publisher.name}
                </p>
              </div>
              <p className="text-xs text-gray-400 font-semibold">
                {format(new Date(edition.createdAt), "dd.MM.yyyy")}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {edition.heroes?.map((hero: any) => (
                <span
                  key={hero._id}
                  className="bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {hero.name}
                </span>
              ))}
            </div>

            {edition.createdBy && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl border border-gray-100">
                <Avatar
                  firstName={edition.createdBy?.firstName || ""}
                  lastName={edition.createdBy?.lastName || ""}
                  profilePicture={edition.createdBy?.profilePicture || ""}
                  size="xs"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {edition.createdBy?.firstName} {edition.createdBy?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{edition.createdBy?.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                className="flex-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-500 hover:text-orange-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => openEdit(edition)}
              >
                <FaEdit size={14} />
                Uredi
              </button>
              <button
                className="flex-1 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => handleDelete(edition._id)}
              >
                <FaTrashAlt size={14} />
                Obriši
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Heroes Modal */}
      {heroModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="flex items-center justify-between bg-gray-950 rounded-t-2xl px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-0.5 bg-orange-500" />
                <h2 className="text-lg font-black text-white">
                  Junaci ({heroModal.heroes.length})
                </h2>
              </div>
              <button
                onClick={() => setHeroModal({ isOpen: false, heroes: [] })}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <IoClose size={20} className="text-white/70" />
              </button>
            </div>
            <div className="p-5 space-y-2 max-h-72 overflow-y-auto">
              {heroModal.heroes.map((hero) => (
                <div
                  key={hero._id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl"
                >
                  <span className="font-bold text-gray-900 text-sm">{hero.name}</span>
                  <span className="bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Junak
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 rounded-b-2xl">
              <button
                onClick={() => setHeroModal({ isOpen: false, heroes: [] })}
                className="w-full bg-gray-950 hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdatePopup && (
        <CreateEditionPopup
          publishers={publishers || []}
          heroes={heroes || []}
          onClose={() => setShowUpdatePopup(false)}
          fetchData={() => onRefresh?.()}
          update={true}
          updateData={updateData}
        />
      )}
    </>
  );
}

export default EditionsTable;
