import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "../core/Avatar";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import type { Comic } from "../../types/Comic";
import { useState } from "react";
import ComicActionPopup from "./ComicActionPopup";

interface ComicAdminPanelTableProps {
  comics: Comic[];
  onRefresh?: () => void;
}

function ComicAdminPanelTable({ comics, onRefresh }: ComicAdminPanelTableProps) {
  const [updateComic, setUpdateComic] = useState(false);
  const [comic, setComic] = useState<Comic | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/api/comics/deleteComic/${id}`);
      showToast("success", "Strip uspješno obrisan");
      onRefresh?.();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri brisanju");
    }
  };

  if (!comics || comics.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-300 text-5xl mb-4 font-black">—</p>
        <p className="text-gray-400 font-semibold">Nema dostupnih stripova</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-950">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Strip</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Br.</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Junak</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Edicija</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreirao</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Datum</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-white/50">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comics.map((comic) => (
              <tr key={comic._id} className="hover:bg-orange-50/50 transition-colors group">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comic.coverImage}
                      alt={comic.title}
                      className="w-9 h-13 object-cover rounded-lg shadow-sm"
                    />
                    <span className="text-sm font-black text-gray-900">{comic.title}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-gray-950 text-white text-xs font-black px-2.5 py-1 rounded-full">
                    #{comic.issueNumber}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                    {comic.hero?.name}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                      {comic.edition?.name}
                    </span>
                    <span className="text-xs text-gray-400">{comic.edition?.publisher?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-center">
                  {comic.createdBy ? (
                    <div className="flex items-center justify-center gap-2">
                      <Avatar
                        firstName={comic.createdBy.firstName || ""}
                        lastName={comic.createdBy.lastName || ""}
                        profilePicture={comic.createdBy.profilePicture || ""}
                        size="xs"
                      />
                      <span className="text-sm font-bold text-gray-900">
                        {comic.createdBy.firstName} {comic.createdBy.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Nepoznat</span>
                  )}
                </td>
                <td className="px-6 py-3 text-center text-gray-400 text-sm">
                  {format(new Date(comic.createdAt), "dd.MM.yyyy")}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex gap-1 items-center justify-end">
                    <button
                      className="p-2 rounded-lg hover:bg-orange-100 text-gray-400 hover:text-orange-500 transition-all cursor-pointer"
                      title="Uredi strip"
                      onClick={() => { setComic(comic); setUpdateComic(true); }}
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Obriši strip"
                      onClick={() => handleDelete(comic._id)}
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
      <div className="md:hidden grid grid-cols-2 gap-3">
        {comics.map((comic) => (
          <div
            key={comic._id}
            className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-md transition-all duration-200"
          >
            <div className="relative">
              <img
                src={comic.coverImage}
                alt={comic.title}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-2 right-2 bg-gray-950 text-white text-xs font-black px-2 py-1 rounded-full shadow">
                #{comic.issueNumber}
              </span>
            </div>

            <div className="p-3 flex flex-col gap-2">
              <p className="text-sm font-black text-gray-900 leading-tight line-clamp-2">{comic.title}</p>

              <div className="flex flex-wrap gap-1">
                <span className="bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {comic.hero?.name}
                </span>
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                  {comic.edition?.name}
                </span>
              </div>

              {comic.createdBy && (
                <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                  <Avatar
                    firstName={comic.createdBy.firstName || ""}
                    lastName={comic.createdBy.lastName || ""}
                    profilePicture={comic.createdBy.profilePicture || ""}
                    size="small"
                  />
                  <p className="text-xs font-bold text-gray-700 leading-none">
                    {comic.createdBy.firstName} {comic.createdBy.lastName}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  className="flex-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-500 hover:text-orange-500 text-xs py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  onClick={() => { setComic(comic); setUpdateComic(true); }}
                >
                  <FaEdit size={11} />
                  Uredi
                </button>
                <button
                  className="flex-1 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-500 text-xs py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  onClick={() => handleDelete(comic._id)}
                >
                  <FaTrashAlt size={11} />
                  Briši
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {updateComic && comic && (
        <ComicActionPopup
          onClose={() => setUpdateComic(false)}
          comic={comic}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

export default ComicAdminPanelTable;
