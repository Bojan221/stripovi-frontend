import { useState, useEffect } from "react";
import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import { axiosPrivate } from "../../api/axiosInstance";
import CreateEditionPopup from "../../components/CreateEditionPopup";
import { showToast } from "../../utils/toast";
import PublisherFilter from "../../components/core/PublisherFilter";
import HeroFilter from "../../components/core/HeroFilter";
import { useSearchParams } from "react-router-dom";
import LoadingIndicator from "../../components/core/LoadingComponent";
function EditionsPage() {
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editions, setEditions] = useState("");
  const [searchParams] = useSearchParams();

  const publisher = searchParams.get("publisher") || "";
  const hero = searchParams.get("hero") || "";

  const fetchEditions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (publisher) queryParams.append("publisher", publisher);
      if (hero) queryParams.append("hero", hero);
      const response = await axiosPrivate.get(`/api/editions/getAllEditions?${queryParams.toString()}`);
      setEditions(response.data);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };
console.log(editions)
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
}, [publisher,hero]); 

  if (isLoading) {
    return <LoadingIndicator  placement="fullscreen" size="lg"/>;
  }

  return (
    <div className="px-4 py-3 min-h-120">
      <div className="flex justify-end">
      <PublisherFilter publishers={publishers || []} />
      <HeroFilter heroes={heroes || []} />
      </div>

      <div>
        <button
          className="py-3 px-5 rounded-lg bg-orange-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
          onClick={() => {
            setIsPopupOpen(true);
          }}
        >
          Dodaj Ediciju
        </button>
      </div>
      {isPopupOpen && publishers && heroes && (
        <CreateEditionPopup
          publishers={publishers}
          heroes={heroes}
          onClose={() => setIsPopupOpen(false)}
          fetchData={() => fetchEditions()}
        />
      )}
    </div>
  );
}

export default EditionsPage;
