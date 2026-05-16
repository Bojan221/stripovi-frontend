import { useState, useEffect } from "react";
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
  const fetchPublishers = async () => {
    try {
      const response = await axiosPrivate.get(
        "/api/publishers/getAllPublishers",
      );
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
        `/api/comics/getAllComics?page=${currentPage}&edition=${edition}&hero=${hero}`,
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
  }, [currentPage, edition]);

  return (
    <div className="px-4 py-3">
      {loading ? (
        <LoadingIndicator size="lg" placement="fullscreen" />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <button
              className="py-3 px-5 rounded-lg bg-orange-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
              onClick={() => {
                setPopupOpen(true);
              }}
            >
              Dodaj Strip
            </button>
            <div className="flex items-center gap-3">
              <PublisherFilter publishers={publishers || []} />
              <HeroFilter heroes={heroes || []} />
              <EditionFilter editions={editions || []} />
            </div>
          </div>

          {popupOpen && (
            <ComicActionPopup onClose={() => setPopupOpen(false)} />
          )}

          <ComicAdminPanelTable comics={comics ?? []} onRefresh={fetchComics} />

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
