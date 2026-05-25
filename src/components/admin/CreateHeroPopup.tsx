import { useState } from "react";
import type { Hero } from "../../types/Hero";
import Popup from "../core/Popup";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";

interface PopupProps {
  onClose: () => void;
  fetch: () => void;
  update?: boolean;
  updateData?: Hero;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400 text-gray-900";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

function CreateHeroPopup({ onClose, fetch, update = false, updateData }: PopupProps) {
  const [name, setName] = useState(updateData?.name || "");
  const [alias, setAlias] = useState(updateData?.alias || "");

  const handleSubmit = async () => {
    if (!name.trim()) return showToast("error", "Ime junaka je obavezno");
    if (!alias.trim()) return showToast("error", "Alias za junaka je obavezan");

    try {
      const heroData = { name, alias };
      if (update && updateData) {
        await axiosPrivate.put(`/api/heroes/updateHero/${updateData._id}`, heroData);
        showToast("success", "Junak uspješno ažuriran");
      } else {
        await axiosPrivate.post("/api/heroes/createHero", heroData);
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
      title={update ? "Ažuriraj Junaka" : "Dodaj Junaka"}
      onClose={onClose}
      onConfirm={handleSubmit}
      buttonText={update ? "Sačuvaj" : "Kreiraj"}
    >
      <div className="px-6 py-6 space-y-5">
        <div>
          <label className={labelClass}>Ime junaka</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Unesite ime junaka"
          />
        </div>
        <div>
          <label className={labelClass}>Alias</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className={inputClass}
            placeholder="npr. dylan-dog (sva mala slova)"
          />
        </div>
      </div>
    </Popup>
  );
}

export default CreateHeroPopup;
