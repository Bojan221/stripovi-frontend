import type { Edition } from "../../types/Edition";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
function EditionFilter({ editions }: { editions: Edition[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editionId, setEditionId] = useState(
    searchParams.get("edition") || null,
  );
  const [editionName, setEditionName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (editionId) {
      const h = editions.find((h) => h._id === editionId);
      setEditionName(h?.name || null);
    }
  }, [editionId, editions]);
  const handleHeroSelect = (id: string, name: string) => {
    setEditionId(id);
    setEditionName(name);
    setDropdownOpen(false);
    setSearchParams({ ...Object.fromEntries(searchParams), edition: id });
  };
  const resetHero = () => {
    const params = Object.fromEntries(searchParams);
    delete params.hero;
    setSearchParams(params);
    setEditionId(null);
    setEditionName(null);
    setDropdownOpen(false);
  };
  return (
    <div className="cursor-pointer relative min-w-37.5">
      <div
        className="flex items-center justify-between gap-2 bg-gray-100 border-slate-100 rounded-lg px-3 py-2"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <p>{editionName ? editionName : "Izaberite ediciju:"}</p>
        <IoIosArrowDown
          className={`h-4 w-4 transition duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </div>
      {dropdownOpen && (
        <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white rounded-lg shadow-lg mt-1 p-2 z-50 max-h-60 overflow-y-auto">
          <p
            className="px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            onClick={() => resetHero()}
          >
            Sve Edicije
          </p>
          {editions.length > 0 &&
            editions.map((edition) => {
              return (
                <p
                  key={edition._id}
                  onClick={() => handleHeroSelect(edition._id, edition.name)}
                  className={`px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors ${editionId === edition._id && "bg-orange-100"}`}
                >
                  {edition.name}
                </p>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default EditionFilter;
