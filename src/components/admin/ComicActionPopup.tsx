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

const API_URL = import.meta.env.VITE_API_URL;

interface PopupProps {
  onClose: () => void;
  comic?: Comic;
  onRefresh?: () => void;
}

function ComicActionPopup({ onClose, comic, onRefresh }: PopupProps) {
  const isUpdate = !!comic;
  const prevPublisherId = useRef(comic?.edition?.publisher?._id || "");

  const [heroes, setHeroes] = useState<Hero[] | null>(null);
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [editions, setEditions] = useState<Edition[] | null>(null);
  const [heroId, setHeroId] = useState<string>(comic?.hero?._id || "");
  const [publisherId, setPublisherId] = useState<string>(
    comic?.edition?.publisher?._id || "",
  );
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
      const response = await axiosPrivate.get(
        "/api/publishers/getAllPublishers",
      );
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
        await axiosPrivate.put(
          `/api/comics/updateComic/${comic._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
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
        <LoadingIndicator />
      ) : (
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
          <CustomSelect
            options={heroes ?? []}
            value={heroId}
            onChange={setHeroId}
            label="Izaberite Heroja"
          />
          <CustomSelect
            options={publishers ?? []}
            value={publisherId}
            onChange={setPublisherId}
            label="Izaberite Izdavača"
          />
          <CustomSelect
            options={editions ?? []}
            value={editionId}
            onChange={setEditionId}
            label="Izaberite Ediciju"
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slika Naslovnice{" "}
              {isUpdate && (
                <span className="text-gray-400 font-normal">(opcionalno)</span>
              )}
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
                  if (e.target.files?.[0]) {
                    setCoverPicture(e.target.files[0]);
                  }
                }}
              />
            </label>
            {previewUrl && (
              <div className="mt-3 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-gray-300 object-contain"
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
