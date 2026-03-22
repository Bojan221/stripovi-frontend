import { useState } from "react";
import CreateHeroPopup from "../../components/CreateHeroPopup";
function CharactersPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="px-4 py-3">
      <div>
        <button
          className="py-3 px-5 rounded-lg bg-orange-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
          onClick={() => setShowPopup(true)}
        >
          Dodaj Junaka
        </button>
      </div>
      <div></div>

      {showPopup && (
        <CreateHeroPopup
          onClose={() => setShowPopup(false)}
          fetch={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default CharactersPage;
