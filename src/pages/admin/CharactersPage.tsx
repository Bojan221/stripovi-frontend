import { useState } from "react";
import CreateHeroPopup from "../../components/CreateHeroPopup";
import HeroesTable from "../../components/HeroesTable";
import type { Hero } from "../../types/Hero";

function CharactersPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [updateHero, setUpdateHero] = useState<Hero | null>(null);

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
    <div className="px-4 py-3">
      <div>
        <button
          className="py-3 px-5 rounded-lg bg-orange-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
          onClick={() => {
            setUpdateHero(null);
            setShowPopup(true);
          }}
        >
          Dodaj Junaka
        </button>
      </div>

      <HeroesTable refresh={refreshTrigger} onEdit={handleEdit} />

      {showPopup && (
        <CreateHeroPopup
          onClose={() => {
            setShowPopup(false);
            setUpdateHero(null);
          }}
          fetch={handleHeroCreated}
          {...(updateHero && {
            updateData: updateHero,
            update: true,
          })}
        />
      )}
    </div>
  );
}

export default CharactersPage;
