import {useState, useEffect} from "react"
import Popup from "./core/Popup"
import CustomSelect from "./core/CustomSelect"
import { axiosPrivate } from "../api/axiosInstance"
import { showToast } from "../utils/toast"
import type { Hero } from "../types/Hero";
import type { Publisher } from "../types/Publisher";
import type { Edition } from "../types/Edition";
import LoadingIndicator from "./core/LoadingComponent"
interface PopupProps{ 
    onClose: ()=> void;
}


function ComicActionPopup({onClose}: PopupProps) {
  const [heroes, setHeroes]= useState<Hero[] | null> (null)
  const [publishers, setPublishers]= useState<Publisher[] | null> (null)
  const [editions, setEditions]= useState<Edition[] | null> (null)
  const [heroId, setHeroId] = useState<string >("")
  const [publisherId, setPublisherId] = useState<string >("")
  const [editionId, setEditionId] = useState<string >("")
  const [title, setTitle] = useState("")
  const [issueNumber, setIssueNumber] = useState("")
  const [coverPicture, setCoverPicture] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
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
        const response = await axiosPrivate.get(`/api/editions/getAllEditions?publisher=${publisherId}`);
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
          await Promise.all([fetchHeroes(), fetchPublishers()]);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    },[])

    useEffect(()=> { 
      const loadEditions = async ()=> { 
        try { 
          await fetchEditions();
          setEditionId("")
        } catch(err) {
          showToast("error","Nije uspjelo") 
        }
      }
      loadEditions()
    },[publisherId])

   const createComic = async () => { 
    
    if(!title.trim() || !issueNumber.trim() || !heroId || !editionId || !coverPicture) { 
      return showToast("error", "Forma nije popunjena ispravno!")
    }
    
    try {
        const formDataToSend = new FormData();
        formDataToSend.append("title", title);
        formDataToSend.append("issueNumber", issueNumber);
        formDataToSend.append("heroId", heroId);
        formDataToSend.append("editionId", editionId);
        formDataToSend.append("cover", coverPicture);
        

      await axiosPrivate.post("/api/comics/createComic", formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      })
      
    } catch (err: any) {
        showToast("error", err?.response?.data?.message || "Došlo je do greške prilikom dodavanja stripa.")
      }
    } 

  return (
    <Popup title="Dodaj Strip" buttonText="Kreiraj" onClose={()=> onClose()} onConfirm={()=>createComic()}>
      {loading? (<LoadingIndicator/>): (
        <div className="px-5 py-3 flex flex-col gap-4">   
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Naslov Stripa
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Unesite naslov stripa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Redni Broj Stripa
            </label>
            <input
              type="text"
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Unesite broj"
            />
          </div>
          <CustomSelect options={heroes ?? []} value={heroId} onChange={setHeroId} label="Izaberite Heroja"/>
          <CustomSelect options={publishers ?? []} value={publisherId} onChange={setPublisherId} label="Izaberite Izdavača"/> 
          <CustomSelect options={editions ?? []} value={editionId} onChange={setEditionId} label="Izaberite Ediciju"/> 
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slika Naslovnice
            </label>
            <label className="flex items-center gap-3 w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-all">
              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap">
                Odaberi sliku
              </span>
              <span className="text-sm text-gray-500 truncate">
                {coverPicture ? coverPicture.name : "Nije odabran fajl"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    setCoverPicture(file)
                  }
                }}
              />
            </label>
            {coverPicture && (
              <div className="mt-3 flex justify-center">
                <img
                  src={URL.createObjectURL(coverPicture)}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-gray-300 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Popup>
  )
}

export default ComicActionPopup