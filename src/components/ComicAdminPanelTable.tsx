import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "./core/Avatar";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import type { Comic } from "../types/Comic";
import { useState } from "react";
import ComicActionPopup from "./ComicActionPopup";
const API_URL = import.meta.env.VITE_API_URL;

interface ComicAdminPanelTableProps {
  comics: Comic[];
  onRefresh?: () => void;
}

function ComicAdminPanelTable({
  comics,
  onRefresh,
}: ComicAdminPanelTableProps) {
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
      <div className="bg-white rounded-lg shadow-md p-12 text-center mt-10">
        <p className="text-gray-500 text-lg">Nema dostupnih stripova</p>
      </div>
    );
  }

  const updateComicData = (comic: Comic) => {
    setUpdateComic(true);
    setComic(comic);
  };
  return (
    <div className="mt-6">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Strip
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Br.
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Junak
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Edicija
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Kreirao
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Datum
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {comics.map((comic, idx) => (
              <tr
                key={comic._id}
                className={`border-b border-slate-200 hover:bg-orange-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`${API_URL}/uploads/comics/${comic.coverImage}`}
                      alt={comic.title}
                      className="w-10 h-14 object-cover rounded shadow"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {comic.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                    #{comic.issueNumber}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {comic.hero?.name}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {comic.edition?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comic.edition?.publisher?.name}
                    </span>
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
                      <span className="text-sm font-medium text-gray-900">
                        {comic.createdBy.firstName} {comic.createdBy.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Nepoznat</span>
                  )}
                </td>
                <td className="px-6 py-3 text-center text-sm text-gray-600">
                  {format(new Date(comic.createdAt), "dd.MM.yyyy")}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex gap-2 items-center justify-end">
                    <button
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => updateComicData(comic)}
                    >
                      <FaEdit size={16} color="orange" />
                    </button>
                    <button
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => handleDelete(comic._id)}
                    >
                      <FaTrashAlt size={16} color="red" />
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
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="relative">
              <img
                src={`${API_URL}/uploads/comics/${comic.coverImage}`}
                alt={comic.title}
                className="w-full h-52 object-cover"
              />
              <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                #{comic.issueNumber}
              </span>
            </div>

            <div className="p-3 flex flex-col gap-2 flex-1">
              <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                {comic.title}
              </p>

              <div className="flex flex-wrap gap-1">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {comic.hero?.name}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {comic.edition?.name}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {comic.edition?.publisher?.name}
                </span>
              </div>

              {comic.createdBy && (
                <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-slate-100">
                  <Avatar
                    firstName={comic.createdBy.firstName || ""}
                    lastName={comic.createdBy.lastName || ""}
                    profilePicture={comic.createdBy.profilePicture || ""}
                    size="small"
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-800 leading-none">
                      {comic.createdBy.firstName} {comic.createdBy.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(comic.createdAt), "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                  onClick={() => updateComicData(comic)}
                >
                  <FaEdit size={12} />
                  Uredi
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors"
                  onClick={() => handleDelete(comic._id)}
                >
                  <FaTrashAlt size={12} />
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
