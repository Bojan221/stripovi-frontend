import type { Publisher } from "../../types/Publisher";
import type { Hero } from "../../types/Hero";
import Popup from "./../core/Popup";
import CustomSelect from "./../core/CustomSelect";
import CustomMultiSelect from "./../core/CustomMultiSelect";
import { useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";

interface PopupProps {
  publishers: Publisher[];
  heroes: Hero[];
  onClose: () => void;
  fetchData: () => void;
  update?: boolean;
  updateData?: {
    publisher?: string;
    edition?: string;
    heroesIds?: string[];
    editionId?: string;
  };
  editionId?: string;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400 text-gray-900";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

function CreateEditionPopup({ publishers, heroes, onClose, fetchData, update = false, updateData }: PopupProps) {
  const [editionName, setEditionName] = useState(updateData?.edition || "");
  const [publisherId, setPublisherId] = useState(updateData?.publisher || "");
  const [heroIds, setHeroIds] = useState<string[]>(updateData?.heroesIds || []);

  const validate = () => {
    if (!editionName.trim()) { showToast("error", "Ime edicije je obavezno"); return false; }
    if (!publisherId) { showToast("error", "Izdavač edicije je obavezan"); return false; }
    if (heroIds.length === 0) { showToast("error", "Junak edicije je obavezan"); return false; }
    return true;
  };

  const createEdition = async () => {
    if (!validate()) return;
    try {
      await axiosPrivate.post("/api/editions/createEdition", {
        name: editionName,
        publisher: publisherId,
        heroes: heroIds,
      });
      showToast("success", "Edicija je uspješno kreirana");
      setEditionName(""); setPublisherId(""); setHeroIds([]);
      fetchData();
      onClose();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške.");
    }
  };

  const updateEdition = async () => {
    if (!validate()) return;
    try {
      await axiosPrivate.put(`/api/editions/updateEdition/${updateData?.editionId}`, {
        name: editionName,
        publisher: publisherId,
        heroes: heroIds,
      });
      showToast("success", "Edicija je uspješno izmijenjena");
      setEditionName(""); setPublisherId(""); setHeroIds([]);
      fetchData();
      onClose();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Došlo je do greške.");
    }
  };

  return (
    <Popup
      onClose={onClose}
      title={update ? "Uredi Ediciju" : "Dodaj Ediciju"}
      buttonText={update ? "Sačuvaj" : "Kreiraj"}
      onConfirm={update ? updateEdition : createEdition}
    >
      <div className="px-6 py-6 space-y-5">
        <div>
          <label className={labelClass}>Naziv edicije</label>
          <input
            type="text"
            value={editionName}
            onChange={(e) => setEditionName(e.target.value)}
            className={inputClass}
            placeholder="Unesite naziv edicije"
          />
        </div>
        <CustomSelect
          label="Izdavač edicije"
          options={publishers}
          value={publisherId}
          onChange={setPublisherId}
          placeholder="Odaberite izdavača"
        />
        <CustomMultiSelect
          label="Junaci edicije"
          options={heroes}
          value={heroIds}
          onChange={setHeroIds}
          placeholder="Odaberite junake"
        />
      </div>
    </Popup>
  );
}

export default CreateEditionPopup;
