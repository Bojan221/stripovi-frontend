import { useState, useEffect } from "react";
import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import type { Edition } from "../../types/Edition";
import { axiosPrivate } from "../../api/axiosInstance";
import CreateEditionPopup from "../../components/CreateEditionPopup";
import EditionsTable from "../../components/EditionsTable";
import { showToast } from "../../utils/toast";
import PublisherFilter from "../../components/core/PublisherFilter";
import HeroFilter from "../../components/core/HeroFilter";
import { useSearchParams } from "react-router-dom";
import LoadingIndicator from "../../components/core/LoadingComponent";
import PaginationRounded from "../../components/core/Pagination";
function EditionsPage() {
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [totalEditions, setTotalEditions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const publisher = searchParams.get("publisher") || "";
  const hero = searchParams.get("hero") || "";
  const page = searchParams.get("page") || "";

  const fetchEditions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (publisher) queryParams.append("publisher", publisher);
      if (hero) queryParams.append("hero", hero);
      if (page) queryParams.append("page", page);
      const response = await axiosPrivate.get(
        `/api/editions/getAllEditions?${queryParams.toString()}`,
      );

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
        showToast(
          "error",
          err?.response?.data?.message || "Došlo je do greške",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [publisher, hero, page]);

  if (isLoading) {
    return <LoadingIndicator placement="fullscreen" size="lg" />;
  }

  return (
    <div className="px-4 py-3 min-h-120">
      <div className="flex justify-between items-center">
        <button
          className="py-3 px-5 rounded-lg bg-orange-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
          onClick={() => {
            setIsPopupOpen(true);
          }}
        >
          Dodaj Ediciju
        </button>
        <div className="flex justify-end gap-2 max-md:hidden">
          <PublisherFilter publishers={publishers || []} />
          <HeroFilter heroes={heroes || []} />
        </div>
      </div>
      {isPopupOpen && publishers && heroes && (
        <CreateEditionPopup
          publishers={publishers}
          heroes={heroes}
          onClose={() => setIsPopupOpen(false)}
          fetchData={() => fetchEditions()}
        />
      )}

      <div>
        <EditionsTable editions={editions} onRefresh={() => fetchEditions()} />
        <div className="flex items-center justify-between pt-3 px-3">
          <div>
            <PaginationRounded totalPages={totalPages} />
          </div>
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-xl">
            Ukupno edicija:
            <span>{totalEditions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditionsPage;
