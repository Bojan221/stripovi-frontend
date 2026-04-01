import {useState,useEffect} from "react"
import ComicActionPopup from "../../components/ComicActionPopup"
import { axiosPrivate } from "../../api/axiosInstance";
import type { Hero } from "../../types/Hero";
import type { Publisher } from "../../types/Publisher";
import type { Edition } from "../../types/Edition";
import { showToast } from "../../utils/toast";
import LoadingIndicator from "../../components/core/LoadingComponent";
function ComicsPage() {
  const [popupOpen,setPopupOpen]= useState(false);
  const [heroes, setHeroes]= useState<Hero[] | null> (null)
  const [publishers, setPublishers]= useState<Publisher[] | null> (null)
  const [editions, setEditions]= useState<Edition[] | null> (null)
  const [loading, setLoading] = useState(true);

  const fetchHeroes = async()=> { 
    try { 
      const response = await axiosPrivate.get("/api/heroes/getAllHeroes");
      setHeroes(response.data.heroes)
    }catch(err:any) { 
      showToast("error", err?.response?.data?.message || "Došlo je do greške")
    }

  }
  const fetchEditions = async () => { 
    try { 
      const response = await axiosPrivate.get("/api/editions/getAllEditions");
      setEditions(response.data.editions)
    }catch(err:any) { 
      showToast("error", err?.response?.data?.message || "Došlo je do greške")
    }
  }
  const fetchPublishers = async () => { 
    try { 
      const response = await axiosPrivate.get("/api/publishers/getAllPublishers");
      setPublishers(response.data)
    }catch(err:any) { 
      showToast("error", err?.response?.data?.message || "Došlo je do greške")
    }
  }

  useEffect(()=> {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchHeroes(), fetchEditions(), fetchPublishers()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  },[])

return (
  <div className="px-4 py-3">
      {loading ? (
        <LoadingIndicator size="lg" placement="fullscreen" />
      ) : (
        <>
          <div>
            <button
                className="py-3 px-5 rounded-lg bg-orange-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
                onClick={() => {
                  setPopupOpen(true);
                }}
              >
                Dodaj Strip
              </button>
            </div>

            {popupOpen && <ComicActionPopup heroes={heroes || []} publishers={publishers || []} editions={editions || []} onClose={()=> setPopupOpen(false)}/>}
        </>
      )}
  </div>
)}

export default ComicsPage;
