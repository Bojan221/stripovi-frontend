import type { Comic } from "../../types/Comic";
import { LuBookmarkPlus } from "react-icons/lu";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";

interface ComicCard {
  comic: Comic;
  showActionsButton?: boolean;
}
function ComicCard({ comic, showActionsButton }: ComicCard) {

  const addToCollection = async (comicId: string) => {
    if (!comicId) return;
    try {
      await axiosPrivate.post("/api/userComics/addToCollection", {comic:comicId});
      showToast("success","Strip je uspjesno dodan!")
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške.")
    }
  };

  return (
    <div className={`group flex flex-col rounded-xl overflow-hidden ${comic.isOwned ? "bg-green-200":"bg-white"} border  border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
      <div className="relative aspect-2/3 overflow-hidden bg-gray-200">
        <img
          src={comic.coverImage}
          alt={comic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
          #{comic.issueNumber}
        </div>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCollection(comic._id);
              }}
              title="Dodaj u kolekciju"
              className="shrink-0 cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-orange-50 hover:bg-orange-500 text-orange-400 hover:text-white transition-colors duration-200"
            >
              <LuBookmarkPlus />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComicCard;
