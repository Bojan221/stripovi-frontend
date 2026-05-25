import { useState, useEffect, useRef } from "react";
import Popup from "../core/Popup";
import CustomSelect from "../core/CustomSelect";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import type { Hero } from "../../types/Hero";
import type { Publisher } from "../../types/Publisher";
import type { Edition } from "../../types/Edition";
import type { Comic } from "../../types/Comic";
import LoadingIndicator from "../core/LoadingComponent";
import { IoImageOutline } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;

interface PopupProps {
  onClose: () => void;
  comic?: Comic;
  onRefresh?: () => void;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400 text-gray-900";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

function ComicActionPopup({ onClose, comic, onRefresh }: PopupProps) {
  const isUpdate = !!comic;
  const prevPublisherId = useRef(comic?.edition?.publisher?._id || "");

  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [editions, setEditions] = useState<Edition[] | null>(null);
  const [heroId, setHeroId] = useState<string>(comic?.hero?._id || "");
  const [publisherId, setPublisherId] = useState<string>(comic?.edition?.publisher?._id || "");
  const [editionId, setEditionId] = useState<string>(comic?.edition?._id || "");
  const [title, setTitle] = useState(comic?.title || "");
  const [issueNumber, setIssueNumber] = useState(comic?.issueNumber || "");
  const [coverPicture, setCoverPicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHeroes = async () => {
    try {
      const response = await axiosPrivate.get("/api/heroes/getAllHeroes");
      setHeroes(response.data.heroes);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  const fetchEditions = async (pubId: string) => {
    try {
      const response = await axiosPrivate.get(
        `/api/editions/getAllEditions?publisher=${pubId}&hero=${heroId}`,
      );
      setEditions(response.data.editions);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axiosPrivate.get("/api/publishers/getAllPublishers");
      setPublishers(response.data);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchHeroes(), fetchPublishers()]);
        await fetchEditions(publisherId);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (prevPublisherId.current === publisherId) return;
    prevPublisherId.current = publisherId;
    fetchEditions(publisherId).then(() => setEditionId(""));
  }, [publisherId]);

  const handleSubmit = async () => {
    if (!title.trim() || !issueNumber.trim() || !heroId || !editionId) {
      return showToast("error", "Forma nije popunjena ispravno!");
    }
    if (!isUpdate && !coverPicture) {
      return showToast("error", "Forma nije popunjena ispravno!");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("issueNumber", issueNumber);
    formData.append("heroId", heroId);
    formData.append("editionId", editionId);
    if (coverPicture) formData.append("cover", coverPicture);

    try {
      if (isUpdate) {
        await axiosPrivate.put(`/api/comics/updateComic/${comic._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", "Strip je uspješno ažuriran.");
      } else {
        await axiosPrivate.post("/api/comics/createComic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", "Strip je uspješno kreiran.");
      }
      onRefresh?.();
      onClose();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške.");
    }
  };

  const previewUrl = coverPicture
    ? URL.createObjectURL(coverPicture)
    : comic?.coverImage
      ? `${API_URL}/uploads/comics/${comic.coverImage}`
      : null;

  return (
    <Popup
      title={isUpdate ? "Uredi Strip" : "Dodaj Strip"}
      buttonText={isUpdate ? "Sačuvaj" : "Kreiraj"}
      onClose={onClose}
      onConfirm={handleSubmit}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Naslov stripa</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Unesite naslov"
              />
            </div>
            <div>
              <label className={labelClass}>Redni broj</label>
              <input
                type="text"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                className={inputClass}
                placeholder="npr. 123"
              />
            </div>
          </div>

          <CustomSelect
            options={heroes ?? []}
            value={heroId}
            onChange={setHeroId}
            label="Junak"
            placeholder="Odaberite junaka"
          />
          <CustomSelect
            options={publishers ?? []}
            value={publisherId}
            onChange={setPublisherId}
            label="Izdavač"
            placeholder="Odaberite izdavača"
          />
          <CustomSelect
            options={editions ?? []}
            value={editionId}
            onChange={setEditionId}
            label="Edicija"
            placeholder="Odaberite ediciju"
          />

          <div>
            <label className={labelClass}>
              Slika naslovnice{" "}
              {isUpdate && <span className="normal-case font-normal text-gray-400">(opcionalno)</span>}
            </label>
            <label className="flex items-center gap-3 w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group">
              <div className="flex items-center gap-2 bg-gray-950 group-hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                <IoImageOutline size={14} />
                Odaberi
              </div>
              <span className="text-sm text-gray-400 truncate">
                {coverPicture ? coverPicture.name : "Nije odabran fajl"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setCoverPicture(e.target.files[0]);
                }}
              />
            </label>
            {previewUrl && (
              <div className="mt-3 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-xl border border-gray-200 object-contain shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Popup>
  );
}

export default ComicActionPopup;
