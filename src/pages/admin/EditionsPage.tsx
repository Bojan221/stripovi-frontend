import { useState, useEffect } from "react";
import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import { axiosPrivate } from "../../api/axiosInstance";
import CreateEditionPopup from "../../components/CreateEditionPopup";
import { showToast } from "../../utils/toast";
function EditionsPage() {
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editions, setEditions] = useState("");

  const fetchEditions = async () => {
    try {
      const response = await axiosPrivate.get("/api/editions/getAllEditions");
      console.log(response.data);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  useEffect(() => {
    const fetchPublishers = async () => {
      const response = await axiosPrivate.get(
        "/api/publishers/getAllPublishers",
      );
      setPublishers(response.data);
    };

    const fetchHeroes = async () => {
      const response = await axiosPrivate.get("/api/heroes/getAllHeroes");
      setHeroes(response.data.heroes);
    };
    fetchPublishers();
    fetchHeroes();
    fetchEditions();
  }, []);

  return (
    <div className="px-4 py-3">
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
