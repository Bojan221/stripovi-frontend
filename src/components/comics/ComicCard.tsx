import type { Comic } from "../../types/Comic";

function ComicCard({ comic }: { comic: Comic }) {
  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
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
          <span className="text-white text-[11px] font-bold leading-tight line-clamp-1 drop-shadow">
            {comic.hero?.name}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-gray-900 font-bold text-sm leading-tight line-clamp-2">
          {comic.title}
        </p>
        <p className="text-gray-400 text-xs font-medium mt-auto">
          {comic.edition?.name}
        </p>
      </div>
    </div>
  );
}

export default ComicCard;
