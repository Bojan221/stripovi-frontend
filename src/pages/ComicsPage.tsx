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
import ComicCard from "../components/comics/ComicCard";
import ComicsFilterSection from "../components/comics/ComicsFilterSection";

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
    }, 800);
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

      <ComicsFilterSection
        publishers={publishers}
        heroes={heroes}
        editions={editions}
        perPage={perPage}
        searchInput={searchInput}
        hasActiveFilters={!!hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        onSearchChange={handleSearchChange}
        onPerPageChange={handlePerPageChange}
        onClearAll={clearAllFilters}
      />

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

export default ComicsPage;
