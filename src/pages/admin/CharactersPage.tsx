import { useState, useRef } from "react";
import CreateHeroPopup from "../../components/admin/CreateHeroPopup";
import HeroesTable from "../../components/admin/HeroesTable";
import type { Hero } from "../../types/Hero";
import { MdPerson } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

function CharactersPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [updateHero, setUpdateHero] = useState<Hero | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch(value), 500);
  };

  const handleHeroCreated = () => {
    setShowPopup(false);
    setUpdateHero(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (hero: Hero) => {
    setUpdateHero(hero);
    setShowPopup(true);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-0.5 bg-orange-500" />
        <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
          Junaci sistema
        </span>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black text-gray-950">
          Svi <span className="text-orange-500">Junaci</span>
        </h2>
        <button
          className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 active:scale-95 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
          onClick={() => { setUpdateHero(null); setShowPopup(true); }}
        >
          <MdPerson size={16} />
          Dodaj Junaka
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Pretraži junake po imenu ili aliasom..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
        />
      </div>

      <HeroesTable refresh={refreshTrigger} onEdit={handleEdit} search={search} />

      {showPopup && (
        <CreateHeroPopup
          onClose={() => { setShowPopup(false); setUpdateHero(null); }}
          fetch={handleHeroCreated}
          {...(updateHero && { updateData: updateHero, update: true })}
        />
      )}
    </div>
  );
}

export default CharactersPage;
