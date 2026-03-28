import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "./core/Avatar";
import { showToast } from "../utils/toast";
import { axiosPrivate } from "../api/axiosInstance";
import type { Edition } from "../types/Edition";
interface EditionsTableProps {
  editions: Edition[];
  onRefresh?: () => void;
  onEdit?: (edition: Edition) => void;
}

interface HeroModalState {
  isOpen: boolean;
  heroes: Array<{ _id: string; name: string }>;
}

function EditionsTable({ editions, onRefresh, onEdit }: EditionsTableProps) {
  const [heroModal, setHeroModal] = useState<HeroModalState>({
    isOpen: false,
    heroes: [],
  });

  const openHeroModal = (heroes: Array<{ _id: string; name: string }>) => {
    setHeroModal({
      isOpen: true,
      heroes,
    });
  };

  const closeHeroModal = () => {
    setHeroModal({
      isOpen: false,
      heroes: [],
    });
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

  if (!editions || editions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center mt-10">
        <p className="text-gray-500 text-lg">Nema dostupnih edicija</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Naziv
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Izdavač
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Junaci
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Kreirao
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                Kreirano u
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {editions.map((edition: Edition, idx) => {
              return (
                <tr
                  key={edition._id}
                  className={`border-b border-slate-200 hover:bg-orange-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {edition.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {edition.publisher.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700">
                    {edition.heroes?.length === 1 ? (
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-200 transition-colors cursor-pointer">
                        {edition.heroes[0].name}
                      </span>
                    ) : (
                      <button
                        onClick={() => openHeroModal(edition.heroes)}
                        className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-200 transition-colors cursor-pointer"
                      >
                        {edition.heroes?.length}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700">
                    {edition.createdBy ? (
                      <div className="flex items-center justify-center gap-3 ">
                        <Avatar
                          firstName={edition.createdBy?.firstName || ""}
                          lastName={edition.createdBy?.lastName || ""}
                          profilePicture={
                            edition.createdBy?.profilePicture || ""
                          }
                          size="xs"
                        />
                        <span className="font-medium text-gray-900">
                          {edition.createdBy?.firstName}{" "}
                          {edition.createdBy?.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Nepoznat korisnik</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {format(new Date(edition.createdAt), "dd-MM-yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right">
                    <div className="flex gap-2 items-center justify-end">
                      <button
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => onEdit?.(edition)}
                      >
                        <FaEdit size={16} color="orange" />
                      </button>
                      <button
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => handleDelete(edition._id)}
                      >
                        <FaTrashAlt size={16} color="red" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile - Compact Scrollable Table */}
      <div className="md:hidden bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-slate-100 border-b border-slate-300 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                Naziv
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 whitespace-nowrap">
                Izdavač
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 whitespace-nowrap">
                Junaci
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 whitespace-nowrap">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {editions.map((edition: Edition, idx) => {
              return (
                <tr
                  key={edition._id}
                  className={`border-b border-slate-200 hover:bg-orange-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3 text-xs text-gray-900 font-medium whitespace-nowrap">
                    {edition.name}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-700">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full truncate max-w-[100px]">
                      {edition.publisher.name.substring(0, 12)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-700">
                    <button
                      onClick={() => openHeroModal(edition.heroes)}
                      className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full hover:bg-green-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {edition.heroes?.length}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-xs">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => onEdit?.(edition)}
                        title="Uredi"
                      >
                        <FaEdit size={14} color="orange" />
                      </button>
                      <button
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => handleDelete(edition._id)}
                        title="Briši"
                      >
                        <FaTrashAlt size={14} color="red" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hero Modal */}
      {heroModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-auto">
            <div className="sticky top-0 bg-linear-to-r from-orange-400 to-orange-500 px-6 py-4 border-b border-orange-600">
              <h2 className="text-xl font-bold text-white">
                Junaci u Ediciji ({heroModal.heroes.length})
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {heroModal.heroes.map((hero) => (
                <div
                  key={hero._id}
                  className="flex items-center justify-between bg-linear-to-r from-orange-50 to-white p-4 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
                >
                  <span className="font-semibold text-gray-900">
                    {hero.name}
                  </span>
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Junak
                  </span>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeHeroModal}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditionsTable;
