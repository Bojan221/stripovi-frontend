import type { Comic } from "../../types/Comic";
import type { ComicCondition } from "../../types/UserComic";
import { LuBookmarkPlus } from "react-icons/lu";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlinePending } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosRemoveCircleOutline } from "react-icons/io";

const conditionConfig: Record<
  ComicCondition,
  { label: string; className: string }
> = {
  mint: { label: "Nov", className: "bg-green-500 text-white" },
  good: { label: "Dobro", className: "bg-blue-500 text-white" },
  used: { label: "Korišten", className: "bg-yellow-400 text-gray-900" },
};

interface ComicCard {
  comic: Comic;
  showActionsButton?: boolean;
  condition?: ComicCondition;
  collection?: boolean;
}
function ComicCard({
  comic,
  showActionsButton,
  condition,
  collection,
}: ComicCard) {
  const queryClient = useQueryClient();
  const [popupOpen, setPopupOpen] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const closePopup = () => {
    setPopupOpen(false);
    setShowConditionPicker(false);
  };

  useEffect(() => {
    if (!popupOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupOpen]);

  const { mutate: addToCollection, isPending: isAddingToCollection } =
    useMutation({
      mutationFn: ({ comicId, condition }: { comicId: string; condition: ComicCondition }) =>
        axiosPrivate.post("/api/userComics/addToCollection", {
          comic: comicId,
          condition,
        }),
      onSuccess: () => {
        showToast("success", "Strip je uspješno dodan u kolekciju!");
        queryClient.invalidateQueries({ queryKey: ["comics"] });
        queryClient.invalidateQueries({ queryKey: ["myCollection"] });
        closePopup();
      },
      onError: (err: any) => {
        showToast(
          "error",
          err?.response?.data?.message || "Došlo je do greške.",
        );
        closePopup();
      },
    });

  const { mutate: addToFavorites, isPending: isAddingToFavorites } =
    useMutation({
      mutationFn: (comicId: string) =>
        axiosPrivate.post("/api/favoriteComics/addToFavorites", { comic: comicId }),
      onSuccess: () => {
        showToast("success", "Strip je dodan u omiljene!");
        queryClient.invalidateQueries({ queryKey: ["comics"] });
        queryClient.invalidateQueries({ queryKey: ["myList"] });
        setPopupOpen(false);
      },
      onError: (err: any) => {
        showToast(
          "error",
          err?.response?.data?.message || "Došlo je do greške.",
        );
        setPopupOpen(false);
      },
    });

  const { mutate: removeFromCollection, isPending: isRemovingFromCollection } =
    useMutation({
      mutationFn: (comicId: string) =>
        axiosPrivate.delete("/api/userComics/deleteComic", {
          data: { comic: comicId },
        }),
      onSuccess: () => {
        showToast("success", "Strip je uklonjen iz kolekcije!");
        queryClient.invalidateQueries({ queryKey: ["comics"] });
        queryClient.invalidateQueries({ queryKey: ["myCollection"] });
        setPopupOpen(false);
      },
      onError: (err: any) => {
        showToast(
          "error",
          err?.response?.data?.message || "Došlo je do greške.",
        );
        setPopupOpen(false);
      },
    });

  const { mutate: removeFromFavorites, isPending: isRemovingFromFavorites } =
    useMutation({
      mutationFn: (comicId: string) =>
        axiosPrivate.delete("/api/favoriteComics/deleteComic", {
          data: { comic: comicId },
        }),
      onSuccess: () => {
        showToast("success", "Strip je uklonjen iz omiljenih!");
        queryClient.invalidateQueries({ queryKey: ["myList"] });
        queryClient.invalidateQueries({ queryKey: ["comics"] });
        setPopupOpen(false);
      },
      onError: (err: any) => {
        showToast(
          "error",
          err?.response?.data?.message || "Došlo je do greške.",
        );
        setPopupOpen(false);
      },
    });

  const isPending =
    isAddingToCollection ||
    isAddingToFavorites ||
    isRemovingFromCollection ||
    isRemovingFromFavorites;

  return (
    <div
      className={`group flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer
        ${comic.isOwned && comic.isFavorite ? "bg-purple-100" : comic.isOwned ? "bg-green-100" : comic.isFavorite ? "bg-red-100" : "bg-white"}`}
    >
      <div className="relative aspect-2/3 overflow-hidden bg-gray-200">
        <img
          src={comic.coverImage}
          alt={comic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
          #{comic.issueNumber}
        </div>
        {condition && conditionConfig[condition] && (
          <div
            className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md ${conditionConfig[condition].className}`}
          >
            {conditionConfig[condition].label}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-1">
          <span className="inline-block bg-green-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-lg min-w-0 truncate">
            {comic.hero?.name}
          </span>
          {(comic.isOwned || comic.isFavorite) && (
            <div className="flex items-center gap-1 shrink-0">
              {comic.isFavorite && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <FaHeart className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              {comic.isOwned && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-gray-900 font-bold text-sm leading-tight line-clamp-2">
          {comic.title}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-gray-400 text-xs font-medium">
              {comic.edition?.name}
            </p>
            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-wide">
              {comic.edition?.publisher?.name}
            </p>
          </div>
          {collection && (
            <button
              onClick={() => {
                removeFromCollection(comic._id);
              }}
              disabled={isRemovingFromCollection}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <IoIosRemoveCircleOutline className="w-3.5 h-3.5 shrink-0" />
              Obrisi iz kolekcije
            </button>
          )}
          {showActionsButton && (
            <div className="relative shrink-0" ref={popupRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupOpen((prev) => !prev);
                  setShowConditionPicker(false);
                }}
                disabled={isPending}
                title="Opcije"
                className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-orange-50 hover:bg-orange-500 text-orange-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? <MdOutlinePending /> : <LuBookmarkPlus />}
              </button>

              {popupOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-9 right-0 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {showConditionPicker ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <button
                          onClick={() => setShowConditionPicker(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-wide">Stanje stripa</span>
                      </div>
                      {(Object.entries(conditionConfig) as [ComicCondition, { label: string; className: string }][]).map(([value, cfg]) => (
                        <button
                          key={value}
                          onClick={() => addToCollection({ comicId: comic._id, condition: value })}
                          disabled={isAddingToCollection}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.className}`} />
                          {cfg.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {comic.isOwned ? (
                        <button
                          onClick={() => removeFromCollection(comic._id)}
                          disabled={isRemovingFromCollection}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <IoIosRemoveCircleOutline className="w-3.5 h-3.5 shrink-0" />
                          Obrisi iz kolekcije
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowConditionPicker(true)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          <LuBookmarkPlus className="w-3.5 h-3.5 shrink-0" />
                          Dodaj u kolekciju
                        </button>
                      )}
                      <div className="h-px bg-gray-100" />
                      {comic.isFavorite ? (
                        <button
                          onClick={() => removeFromFavorites(comic._id)}
                          disabled={isRemovingFromFavorites}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <IoIosRemoveCircleOutline className="w-3.5 h-3.5 shrink-0" />
                          Ukloni iz omiljenih
                        </button>
                      ) : (
                        <button
                          onClick={() => addToFavorites(comic._id)}
                          disabled={isAddingToFavorites}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <FaRegHeart className="w-3.5 h-3.5 shrink-0" />
                          Dodaj u omiljene
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComicCard;
