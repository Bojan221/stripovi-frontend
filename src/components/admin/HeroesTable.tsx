import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import type { Hero } from "../../types/Hero";
import LoadingComponent from "../core/LoadingComponent";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "../core/Avatar";
import { showToast } from "../../utils/toast";

interface HeroesTableProps {
  refresh?: number;
  onEdit?: (hero: Hero) => void;
  search?: string;
}

function HeroesTable({ refresh, onEdit, search = "" }: HeroesTableProps) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroes();
  }, [refresh, search]);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/api/heroes/getAllHeroes${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      );
      setHeroes(response.data.heroes || []);
    } catch {
      showToast("error", "Greška pri dohvaćanju junaka");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/api/heroes/deleteHero/${id}`);
      showToast("success", "Uspješno obrisan junak");
      fetchHeroes();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri brisanju");
    }
  };

  if (loading) return <LoadingComponent placement="fullscreen" size="lg" />;

  if (!heroes || heroes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-300 text-5xl mb-4 font-black">—</p>
        <p className="text-gray-400 font-semibold">
          {search ? `Nema rezultata za "${search}"` : "Nema dostupnih junaka"}
        </p>
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
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-white/50">Ime</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Alias</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreirao</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white/50">Kreirano</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-white/50">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {heroes.map((hero: Hero) => (
              <tr key={hero._id} className="hover:bg-orange-50/50 transition-colors group">
                <td className="px-6 py-4 font-black text-gray-900 text-sm">{hero.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                    {hero.alias}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {hero.createdBy ? (
                    <div className="flex items-center justify-center gap-2">
                      <Avatar
                        firstName={hero.createdBy?.firstName || ""}
                        lastName={hero.createdBy?.lastName || ""}
                        profilePicture={hero.createdBy?.profilePicture || ""}
                        size="xs"
                      />
                      <span className="text-sm font-bold text-gray-900">
                        {hero.createdBy?.firstName} {hero.createdBy?.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Nepoznat</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-gray-400 text-sm">
                  {format(new Date(hero.createdAt), "dd.MM.yyyy HH:mm")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-1 items-center justify-end">
                    <button
                      className="p-2 rounded-lg hover:bg-orange-100 text-gray-400 hover:text-orange-500 transition-all cursor-pointer"
                      title="Uredi junaka"
                      onClick={() => onEdit?.(hero)}
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Obriši junaka"
                      onClick={() => handleDelete(hero._id)}
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
        {heroes.map((hero: Hero) => (
          <div
            key={hero._id}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-lg font-black text-gray-950">{hero.name}</p>
                <span className="inline-block bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full mt-1">
                  {hero.alias}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-semibold">
                {format(new Date(hero.createdAt), "dd.MM.yyyy")}
              </p>
            </div>

            {hero.createdBy && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl border border-gray-100">
                <Avatar
                  firstName={hero.createdBy?.firstName || ""}
                  lastName={hero.createdBy?.lastName || ""}
                  profilePicture={hero.createdBy?.profilePicture || ""}
                  size="xs"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {hero.createdBy?.firstName} {hero.createdBy?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{hero.createdBy?.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                className="flex-1 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-500 hover:text-orange-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => onEdit?.(hero)}
              >
                <FaEdit size={14} />
                Uredi
              </button>
              <button
                className="flex-1 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => handleDelete(hero._id)}
              >
                <FaTrashAlt size={14} />
                Obriši
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default HeroesTable;
