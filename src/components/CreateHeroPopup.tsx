import { useState } from "react";
import type { Hero } from "../types/Hero";
import Popup from "./core/Popup";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
interface PopupProps {
  onClose: () => void;
  fetch: () => void;
  update?: boolean;
  updateData?: Hero;
}
function CreateHeroPopup({
  onClose,
  fetch,
  update = false,
  updateData,
}: PopupProps) {
  const [name, setName] = useState(updateData?.name || "");
  const [alias, setAlias] = useState(updateData?.alias || "");

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        return showToast("error", "Ime junaka je obavezno");
      }
      if (!alias.trim()) {
        return showToast("error", "Alias za junaka je obavezan");
      }

      const heroData = {
        name,
        alias,
      };

      if (update && updateData) {
        await axiosPrivate.put(
          `/api/heroes/updateHero/${updateData._id}`,
          heroData,
        );
        showToast("success", "Junak uspješno ažuriran");
      } else {
        await axiosPrivate.post(
          "/api/heroes/createHero",
          heroData,
        );
        showToast("success", "Junak uspješno kreiran");
      }

      fetch();
      onClose();

    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri spremanju");
    }
  };
  return (
    <Popup
      title={update ? "Ažuriraj Junaka" : "Kreiraj Junaka"}
      onClose={onClose}
      onConfirm={handleSubmit}
      buttonText={update ? "Ažuriraj" : "Kreiraj"}
    >
      <div className="px-6 py-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ime Heroja
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Unesite ime junaka"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alias
          </label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Unesite alias junaka (poželjno kao ime junaka, sva mala slova)"
          />
        </div>
      </div>
    </Popup>
  );
}

export default CreateHeroPopup;
