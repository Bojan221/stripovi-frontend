import { useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import type { Hero } from "../types/Hero";
import type { Publisher } from "../types/Publisher";
import type { Edition } from "../types/Edition";
import type { UserComic } from "../types/UserComic";
import PaginationRounded from "../components/core/Pagination";
import LoadingIndicator from "../components/core/LoadingComponent";
import ComicCard from "../components/comics/ComicCard";
import ComicsFilterSection from "../components/comics/ComicsFilterSection";
import { useQuery } from "@tanstack/react-query";

function MyCollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const publisher = searchParams.get("publisher") || "";
  const hero = searchParams.get("hero") || "";
  const edition = searchParams.get("edition") || "";
  const search = searchParams.get("search") || "";
  const perPage = Number(searchParams.get("perPage")) || 12;

  const [searchInput, setSearchInput] = useState(search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPublisher = useRef(publisher);

  const activeFiltersCount = [publisher, hero, edition].filter(Boolean).length;

  const { data: metaData, error: metaError } = useQuery({
    queryKey: ["meta"],
    queryFn: async () => {
      const [pubRes, heroRes] = await Promise.all([
        axiosPrivate.get("/api/publishers/getAllPublishers"),
        axiosPrivate.get("/api/heroes/getAllHeroes"),
      ]);
      return {
        publishers: pubRes.data as Publisher[],
        heroes: heroRes.data.heroes as Hero[],
      };
    },
    staleTime: Infinity,
  });

  const publishers = metaData?.publishers ?? [];
  const heroes = metaData?.heroes ?? [];

  if (metaError) showToast("error", "Greška pri učitavanju filtera");

  const { data: editionsData } = useQuery({
    queryKey: ["editions", publisher, hero],
    queryFn: async () => {
      const res = await axiosPrivate.get(
        `/api/editions/getAllEditions?publisher=${publisher}&hero=${hero}`,
      );
      return res.data.editions as Edition[];
    },
  });

  const editions = editionsData ?? [];

  const prevPublisherVal = prevPublisher.current;
  if (prevPublisherVal !== publisher) {
    prevPublisher.current = publisher;
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      delete params.edition;
      delete params.page;
      return params;
    });
  }

  const {
    data: collectionData,
    isLoading,
    error: collectionError,
  } = useQuery({
    queryKey: ["myCollection", currentPage, publisher, hero, edition, search, perPage],
    queryFn: async () => {
      const res = await axiosPrivate.get(
        `/api/userComics/getUserComics?page=${currentPage}&publisher=${publisher}&hero=${hero}&edition=${edition}&search=${search}&limit=${perPage}`,
      );
      
      return {
        userComics: res.data.comics as UserComic[],
        totalPages: res.data.totalPages as number,
        total: (res.data.totalComics ?? 0) as number,
      };
    },
  });

  if (collectionError) {
    const err = collectionError as any;
    showToast("error", err?.response?.data?.message || "Došlo je do greške");
  }

  const userComics = collectionData?.userComics ?? [];
  const totalPages = collectionData?.totalPages ?? 1;
  const totalComics = collectionData?.total ?? 0;

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

      <div className="bg-gray-950 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-orange-500" />
            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
              Moja biblioteka
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Moja <span className="text-orange-500">Kolekcija</span>
            </h1>
            {!isLoading && (
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

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {isLoading ? (
          <LoadingIndicator size="lg" placement="fullscreen" />
        ) : userComics.length === 0 ? (
          <div className="text-center py-24">
            {hasActiveFilters ? (
              <>
                <p className="text-gray-400 text-lg font-semibold">
                  Nema stripova koji odgovaraju filterima.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors"
                >
                  Očisti filtere
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-900 font-black text-xl mb-1">
                  Kolekcija je prazna
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Dodaj stripove iz kataloga klikom na bookmark ikonicu.
                </p>
                <Link
                  to="/comics"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Pregledaj stripove
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {userComics.map((uc) => (
                <ComicCard key={uc._id} comic={{ ...uc.comic, isOwned: true }} condition={uc.condition} collection={true}/>
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

export default MyCollectionPage;
