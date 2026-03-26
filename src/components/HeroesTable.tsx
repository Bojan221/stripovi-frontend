import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";
import type { Hero } from "../types/Hero";
import LoadingComponent from "./core/LoadingComponent";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "./core/Avatar";
import { showToast } from "../utils/toast";

interface HeroesTableProps {
  refresh?: number;
  onEdit?: (hero: Hero) => void;
}

function HeroesTable({ refresh, onEdit }: HeroesTableProps) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroes();
  }, [refresh]);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("/api/heroes/getAllHeroes");
      setHeroes(response.data.heroes || []);
    } catch (error) {
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

  return (
    <div className="mt-10">
      {heroes && heroes.length > 0 ? (
        <>
          {/* Desktop - Tabela */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Ime
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Alias
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
                {heroes.map((hero: Hero, idx) => {
                  return (
                    <tr
                      key={hero._id}
                      className={`border-b border-slate-200 hover:bg-orange-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {hero.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">
                        {hero.alias}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">
                        {hero.createdBy ? (
                          <div className="flex items-center justify-center gap-3">
                            <Avatar
                              firstName={hero.createdBy?.firstName || ""}
                              lastName={hero.createdBy?.lastName || ""}
                              profilePicture={
                                hero.createdBy?.profilePicture || ""
                              }
                              size="xs"
                            />
                            <span className="font-medium text-gray-900">
                              {hero.createdBy?.firstName}{" "}
                              {hero.createdBy?.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Nepoznat korisnik
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {format(new Date(hero.createdAt), "dd-MM-yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-right">
                        <div className="flex gap-2 items-center justify-end">
                          <button
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => onEdit?.(hero)}
                          >
                            <FaEdit size={16} color="orange" />
                          </button>
                          <button
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleDelete(hero._id)}
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

          {/* Mobile - Cards */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {heroes.map((hero: Hero) => {
              return (
                <div
                  key={hero._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-orange-400"
                >
                  <div className="p-5">
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <p className="font-bold text-gray-900 text-2xl mb-2">
                        {hero.name}
                      </p>
                      <p className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {hero.alias}
                      </p>
                    </div>

                    <div className="space-y-3 bg-slate-50 rounded-lg p-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          Kreirao
                        </p>
                        {hero.createdBy ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar
                              firstName={hero.createdBy?.firstName || ""}
                              lastName={hero.createdBy?.lastName || ""}
                              profilePicture={
                                hero.createdBy?.profilePicture || ""
                              }
                              size="medium"
                            />
                            <div>
                              <p className="text-sm text-gray-900 font-medium">
                                {hero.createdBy?.firstName}{" "}
                                {hero.createdBy?.lastName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {hero.createdBy?.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            Nepoznat korisnik
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          Datum kreiranja
                        </p>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {format(new Date(hero.createdAt), "dd-MM-yyyy HH:mm")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center"
                        onClick={() => onEdit?.(hero)}
                      >
                        <FaEdit size={16} className="mr-2" />
                        Uredi
                      </button>
                      <button
                        className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center"
                        onClick={() => handleDelete(hero._id)}
                      >
                        <FaTrashAlt size={16} className="mr-2" />
                        Briši
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Nema dostupnih junaka</p>
        </div>
      )}
    </div>
  );
}

export default HeroesTable;
