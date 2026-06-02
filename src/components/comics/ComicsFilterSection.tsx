import { useState } from "react";
import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import type { Edition } from "../../types/Edition";
import PublisherFilter from "../core/PublisherFilter";
import HeroFilter from "../core/HeroFilter";
import EditionFilter from "../core/EditionFilter";

const PER_PAGE_OPTIONS = [12, 24, 48];

interface Props {
  publishers: Publisher[];
  heroes: Hero[];
  editions: Edition[];
  perPage: number;
  searchInput: string;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  onSearchChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
  onClearAll: () => void;
}

function ComicsFilterSection({
  publishers,
  heroes,
  editions,
  perPage,
  searchInput,
  hasActiveFilters,
  activeFiltersCount,
  onSearchChange,
  onPerPageChange,
  onClearAll,
}: Props) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  return (
    <>
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-3">

          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pretraži stripove..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-3">
            <PublisherFilter publishers={publishers} />
            <HeroFilter heroes={heroes} />
            <EditionFilter editions={editions} />

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">
                Po stranici:
              </span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                {PER_PAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onPerPageChange(opt)}
                    className={`px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      perPage === opt
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors whitespace-nowrap cursor-pointer"
              >
                Očisti ×
              </button>
            )}
          </div>

          <button
            onClick={() => setFilterSheetOpen(true)}
            className="lg:hidden relative flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-orange-400 hover:text-orange-500 transition-colors cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M7 10h10M11 16h2"
              />
            </svg>
            Filteri
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          filterSheetOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterSheetOpen(false)}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out lg:hidden ${
          filterSheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <span className="font-black text-gray-950 text-lg">Filteri</span>
          <button
            onClick={() => setFilterSheetOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Izdavač
            </p>
            <PublisherFilter publishers={publishers} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Junak
            </p>
            <HeroFilter heroes={heroes} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Edicija
            </p>
            <EditionFilter editions={editions} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Po stranici
            </p>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
              {PER_PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onPerPageChange(opt)}
                  className={`px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                    perPage === opt
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
            <button
              onClick={() => {
                onClearAll();
                setFilterSheetOpen(false);
              }}
              className="w-full py-3 text-sm font-bold text-red-400 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              Očisti sve filtere
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ComicsFilterSection;
