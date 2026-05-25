import { useState, useEffect, useRef } from "react";
import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import type { Edition } from "../../types/Edition";
import { axiosPrivate } from "../../api/axiosInstance";
import CreateEditionPopup from "../../components/admin/CreateEditionPopup";
import EditionsTable from "../../components/admin/EditionsTable";
import { showToast } from "../../utils/toast";
import PublisherFilter from "../../components/core/PublisherFilter";
import HeroFilter from "../../components/core/HeroFilter";
import { useSearchParams } from "react-router-dom";
import LoadingIndicator from "../../components/core/LoadingComponent";
import PaginationRounded from "../../components/core/Pagination";
import { MdCollectionsBookmark } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

function EditionsPage() {
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [totalEditions, setTotalEditions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchParams] = useSearchParams();

  const publisher = searchParams.get("publisher") || "";
  const hero = searchParams.get("hero") || "";
  const page = searchParams.get("page") || "";

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch(value), 500);
  };

  const fetchEditions = async (searchQuery = search) => {
    try {
      const queryParams = new URLSearchParams();
      if (publisher) queryParams.append("publisher", publisher);
      if (hero) queryParams.append("hero", hero);
      if (page) queryParams.append("page", page);
      if (searchQuery) queryParams.append("search", searchQuery);
      const response = await axiosPrivate.get(`/api/editions/getAllEditions?${queryParams.toString()}`);
      setEditions(response.data.editions);
      setTotalEditions(response.data.totalEditions);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [publishersRes, heroesRes] = await Promise.all([
          axiosPrivate.get("/api/publishers/getAllPublishers"),
          axiosPrivate.get("/api/heroes/getAllHeroes"),
        ]);
        setPublishers(publishersRes.data);
        setHeroes(heroesRes.data.heroes);
        await fetchEditions();
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || "Došlo je do greške");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [publisher, hero, page]);

  useEffect(() => {
    if (!isLoading) fetchEditions(search);
  }, [search]);

  if (isLoading) return <LoadingIndicator placement="fullscreen" size="lg" />;

  return (
    <div className="p-6 md:p-8">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-0.5 bg-orange-500" />
        <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
          Edicije sistema
        </span>
      </div>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-2xl font-black text-gray-950">
          Sve <span className="text-orange-500">Edicije</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <PublisherFilter publishers={publishers || []} />
          <HeroFilter heroes={heroes || []} />
          <button
            className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 active:scale-95 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
            <MdCollectionsBookmark size={16} />
            Dodaj Ediciju
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Pretraži edicije po nazivu..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
        />
      </div>

      {isPopupOpen && publishers && heroes && (
        <CreateEditionPopup
          publishers={publishers}
          heroes={heroes}
          onClose={() => setIsPopupOpen(false)}
          fetchData={() => fetchEditions()}
        />
      )}

      <EditionsTable
        editions={editions}
        onRefresh={() => fetchEditions()}
        publishers={publishers || []}
        heroes={heroes || []}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 px-1">
        <PaginationRounded totalPages={totalPages} />
        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
          Ukupno:
          <span className="text-gray-950 text-xl font-black">{totalEditions}</span>
        </div>
      </div>
    </div>
  );
}

export default EditionsPage;
