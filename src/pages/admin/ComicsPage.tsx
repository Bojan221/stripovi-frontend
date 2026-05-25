import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ComicActionPopup from "../../components/admin/ComicActionPopup";
import { axiosPrivate } from "../../api/axiosInstance";
import type { Hero } from "../../types/Hero";
import type { Publisher } from "../../types/Publisher";
import type { Edition } from "../../types/Edition";
import type { Comic } from "../../types/Comic";
import { showToast } from "../../utils/toast";
import LoadingIndicator from "../../components/core/LoadingComponent";
import ComicAdminPanelTable from "../../components/admin/ComicAdminPanelTable";
import PaginationRounded from "../../components/core/Pagination";
import PublisherFilter from "../../components/core/PublisherFilter";
import HeroFilter from "../../components/core/HeroFilter";
import EditionFilter from "../../components/core/EditionFilter";
import { MdAutoStories } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

function ComicsPage() {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const publisher = searchParams.get("publisher") || "";
  const hero = searchParams.get("hero") || "";
  const edition = searchParams.get("edition") || "";
  const [popupOpen, setPopupOpen] = useState(false);
  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [editions, setEditions] = useState<Edition[] | null>(null);
  const [comics, setComics] = useState<Comic[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch(value), 500);
  };

  const fetchPublishers = async () => {
    try {
      const response = await axiosPrivate.get("/api/publishers/getAllPublishers");
      setPublishers(response.data);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  const fetchHeroes = async () => {
    try {
      const response = await axiosPrivate.get("/api/heroes/getAllHeroes");
      setHeroes(response.data.heroes);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  const fetchEditions = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/editions/getAllEditions?publisher=${publisher}&hero=${hero}`,
      );
      setEditions(response.data.editions);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  const fetchComics = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/api/comics/getAllComics?page=${currentPage}&edition=${edition}&hero=${hero}&search=${search}`,
      );
      setComics(response.data.comics);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
    fetchHeroes();
  }, []);

  useEffect(() => {
    fetchEditions();
  }, [publisher, hero]);

  useEffect(() => {
    fetchComics();
  }, [currentPage, edition, search]);

  return (
    <div className="p-6 md:p-8">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-0.5 bg-orange-500" />
        <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
          Stripovi sistema
        </span>
      </div>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-2xl font-black text-gray-950">
          Svi <span className="text-orange-500">Stripovi</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <PublisherFilter publishers={publishers || []} />
          <HeroFilter heroes={heroes || []} />
          <EditionFilter editions={editions || []} />
          <button
            className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 active:scale-95 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
            onClick={() => setPopupOpen(true)}
          >
            <MdAutoStories size={16} />
            Dodaj Strip
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
          placeholder="Pretraži stripove po naslovu..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
        />
      </div>

      {loading ? (
        <LoadingIndicator size="lg" placement="fullscreen" />
      ) : (
        <>
          {popupOpen && <ComicActionPopup onClose={() => setPopupOpen(false)} onRefresh={fetchComics} />}

          <ComicAdminPanelTable comics={comics ?? []} onRefresh={fetchComics}  />

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <PaginationRounded totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ComicsPage;
