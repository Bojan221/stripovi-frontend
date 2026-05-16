import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import type { Comic } from "../types/Comic";
import type { Hero } from "../types/Hero";
import type { Publisher } from "../types/Publisher";
import type { Edition } from "../types/Edition";
import PaginationRounded from "../components/core/Pagination";
import LoadingIndicator from "../components/core/LoadingComponent";
import PublisherFilter from "../components/core/PublisherFilter";
import HeroFilter from "../components/core/HeroFilter";
import EditionFilter from "../components/core/EditionFilter";

const API_URL = import.meta.env.VITE_API_URL;
const PER_PAGE_OPTIONS = [12, 24, 48];

function ComicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const publisher = searchParams.get("publisher") || "";
  const hero = searchParams.get("hero") || "";
  const edition = searchParams.get("edition") || "";
  const search = searchParams.get("search") || "";
  const perPage = Number(searchParams.get("perPage")) || 12;

  const [comics, setComics] = useState<Comic[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComics, setTotalComics] = useState(0);
  const [loading, setLoading] = useState(true);

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);

  const [searchInput, setSearchInput] = useState(search);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPublisher = useRef(publisher);

  const activeFiltersCount = [publisher, hero, edition].filter(Boolean).length;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [pubRes, heroRes] = await Promise.all([
          axiosPrivate.get("/api/publishers/getAllPublishers"),
          axiosPrivate.get("/api/heroes/getAllHeroes"),
        ]);
        setPublishers(pubRes.data);
        setHeroes(heroRes.data.heroes);
      } catch {
        showToast("error", "Greška pri učitavanju filtera");
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const res = await axiosPrivate.get(
          `/api/editions/getAllEditions?publisher=${publisher}&hero=${hero}`,
        );
        setEditions(res.data.editions);
      } catch {
        showToast("error", "Greška pri učitavanju edicija");
      }
    };

    if (prevPublisher.current !== publisher) {
      prevPublisher.current = publisher;
      setSearchParams((prev) => {
        const params = Object.fromEntries(prev);
        delete params.edition;
        delete params.page;
        return params;
      });
    }

    fetchEditions();
  }, [publisher, hero]);

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(
          `/api/comics/getAllComics?page=${currentPage}&publisher=${publisher}&hero=${hero}&edition=${edition}&search=${search}&limit=${perPage}`,
        );
        setComics(res.data.comics);
        setTotalPages(res.data.totalPages);
        setTotalComics(res.data.total ?? res.data.comics.length);
      } catch (err: any) {
        showToast(
          "error",
          err?.response?.data?.message || "Došlo je do greške",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, [currentPage, publisher, hero, edition, search, perPage]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchParams((prev) => {
        const params = Object.fromEntries(prev);
        if (value) {
          params.search = value;
        } else {
          delete params.search;
        }
        delete params.page;
        return params;
      });
    }, 400);
  };

  const handlePerPageChange = (value: number) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      params.perPage = String(value);
      delete params.page;
      return params;
    });
  };

  const hasActiveFilters = publisher || hero || edition || search;

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-gray-950 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-orange-500" />
            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
              Bonelli kolekcija
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Svi <span className="text-orange-500">Stripovi</span>
            </h1>
            {!loading && (
              <span className="text-white/30 text-sm font-semibold">
                {totalComics} stripova
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-3">
          {/* Search — always visible */}
          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Pretraži stripove..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-3">
            <PublisherFilter publishers={publishers} />
            <HeroFilter heroes={heroes} />
            <EditionFilter editions={editions} />

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">
                Po stranici:
              </span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                {PER_PAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePerPageChange(opt)}
                    className={`px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      perPage === opt
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors whitespace-nowrap cursor-pointer"
              >
                Očisti ×
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setFilterSheetOpen(true)}
            className="lg:hidden relative flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-orange-400 hover:text-orange-500 transition-colors cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M7 10h10M11 16h2"
              />
            </svg>
            Filteri
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filter sheet overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          filterSheetOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterSheetOpen(false)}
      />

      {/* Mobile filter bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[70%] bg-white rounded-t-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out lg:hidden ${
          filterSheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <span className="font-black text-gray-950 text-lg">Filteri</span>
          <button
            onClick={() => setFilterSheetOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sheet content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Izdavač
            </p>
            <PublisherFilter publishers={publishers} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Junak
            </p>
            <HeroFilter heroes={heroes} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Edicija
            </p>
            <EditionFilter editions={editions} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Po stranici
            </p>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
              {PER_PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePerPageChange(opt)}
                  className={`px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                    perPage === opt
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sheet footer */}
        {hasActiveFilters && (
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
            <button
              onClick={() => {
                clearAllFilters();
                setFilterSheetOpen(false);
              }}
              className="w-full py-3 text-sm font-bold text-red-400 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              Očisti sve filtere
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {loading ? (
          <LoadingIndicator size="lg" placement="fullscreen" />
        ) : comics.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg font-semibold">
              Nema stripova koji odgovaraju filterima.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors"
              >
                Očisti filtere
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {comics.map((comic) => (
                <ComicCard key={comic._id} comic={comic} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <PaginationRounded totalPages={totalPages} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ComicCard({ comic }: { comic: Comic }) {
  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="relative aspect-2/3 overflow-hidden bg-gray-200">
        <img
          src={`${API_URL}/uploads/comics/${comic.coverImage}`}
          alt={comic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
          #{comic.issueNumber}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <span className="text-white text-[11px] font-bold leading-tight line-clamp-1 drop-shadow">
            {comic.hero?.name}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-gray-900 font-bold text-sm leading-tight line-clamp-2">
          {comic.title}
        </p>
        <p className="text-gray-400 text-xs font-medium mt-auto">
          {comic.edition?.name}
        </p>
      </div>
    </div>
  );
}

export default ComicsPage;
