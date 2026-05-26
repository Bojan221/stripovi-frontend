import type { Comic } from "../../types/Comic";
import type { ComicCondition } from "../../types/UserComic";
import { LuBookmarkPlus } from "react-icons/lu";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlinePending } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";

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
}
function ComicCard({ comic, showActionsButton, condition }: ComicCard) {
  const queryClient = useQueryClient();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popupOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupOpen]);

  const { mutate: addToCollection, isPending: isAddingToCollection } =
    useMutation({
      mutationFn: (comicId: string) =>
        axiosPrivate.post("/api/userComics/addToCollection", {
          comic: comicId,
        }),
      onSuccess: () => {
        showToast("success", "Strip je uspješno dodan u kolekciju!");
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

  const { mutate: addToFavorites, isPending: isAddingToFavorites } =
    useMutation({
      mutationFn: (comicId: string) =>
        axiosPrivate.post("/api/userComics/addToFavorites", { comic: comicId }),
      onSuccess: () => {
        showToast("success", "Strip je dodan u omiljene!");
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

  const isPending = isAddingToCollection || isAddingToFavorites;

  return (
    <div
      className={`group flex flex-col rounded-xl overflow-hidden ${comic.isOwned ? "bg-green-200" : "bg-white"} border  border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
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
        <div className="absolute bottom-2 left-2 right-2">
          <span className="inline-block bg-green-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-lg max-w-full truncate">
            {comic.hero?.name}
          </span>
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
          {showActionsButton && !comic.isOwned && (
            <div className="relative shrink-0" ref={popupRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupOpen((prev) => !prev);
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
                  <button
                    onClick={() => addToCollection(comic._id)}
                    disabled={isAddingToCollection}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <LuBookmarkPlus className="w-3.5 h-3.5 shrink-0" />
                    Dodaj u kolekciju
                  </button>
                  <div className="h-px bg-gray-100" />
                  <button
                    onClick={() => addToFavorites(comic._id)}
                    disabled={isAddingToFavorites}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <FaRegHeart />
                    Dodaj u omiljene
                  </button>
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
