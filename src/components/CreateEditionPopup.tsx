import type { Publisher } from "../types/Publisher";
import type { Hero } from "../types/Hero";
import Popup from "./core/Popup";
import CustomSelect from "./core/CustomSelect";
import CustomMultiSelect from "./core/CustomMultiSelect";
import { useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
interface PopupProps {
  publishers: Publisher[];
  heroes: Hero[];
  onClose: () => void;
  fetchData: () => void;
  update?:boolean;
  updateData?: {
    publisher?:string;
    edition?:string;
    heroesIds?:string[];
    editionId?:string;
  };
  editionId?:string;
}
function CreateEditionPopup({
  publishers,
  heroes,
  onClose,
  fetchData,
  update=false,
  updateData

}: PopupProps) {
  const [editionName, setEditionName] = useState(updateData?.edition || "");
  const [publisherId, setPublisherId] = useState(updateData?.publisher || "");
  const [heroIds, setHeroIds] = useState<string[]>(updateData?.heroesIds || []);

  const createEdition = async () => {
    try {
      if (!editionName.trim()) {
        return showToast("error", "Ime edicije je obavezno");
      }
      if (!publisherId) {
        return showToast("error", "Izdavač edicije je obavezan");
      }
      if (heroIds.length === 0) {
        return showToast("error", "Junak edicije je obavezan");
      }

      const editionData = {
        name: editionName,
        publisher: publisherId,
        heroes: heroIds,
      };

      await axiosPrivate.post("/api/editions/createEdition", editionData);
      showToast("success", "Edicija je uspješno kreirana");
      setEditionName("");
      setPublisherId("");
      setHeroIds([]);
      fetchData();
      onClose();
    } catch (err: any) {
      showToast(
        "error",
        err?.response?.data?.message ||
          "Došlo je do greške prilikom kreiranja edicije.",
      );
    }
  };

  const updateEdition = async () => { 
    try {
      if (!editionName.trim()) {
        return showToast("error", "Ime edicije je obavezno");
      }
      if (!publisherId) {
        return showToast("error", "Izdavač edicije je obavezan");
      }
      if (heroIds.length === 0) {
        return showToast("error", "Junak edicije je obavezan");
      }
      const editionId = updateData?.editionId
        const editionData = {
          name: editionName,
          publisher: publisherId,
          heroes: heroIds,
        };
      await axiosPrivate.put(`/api/editions/updateEdition/${editionId}`, editionData)

       showToast("success", "Edicija je uspješno izmijenjena");
      setEditionName("");
      setPublisherId("");
      setHeroIds([]);
      fetchData();
      onClose();
    }catch (err:any) { 
      showToast("error", err?.response?.data?.message || "Došlo je do greške prilikom ažuriranja edicije.")
    }
  }
  return (
    <Popup
      onClose={onClose}
      title={update? "Uredi Ediciju":"Kreiraj Ediciju"}
      buttonText={update? "Ažuriraj":"Kreiraj"}
      onConfirm={update?()=> updateEdition() :() => createEdition()}
    >
      <div className="px-6 py-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Naziv
          </label>
          <input
            type="text"
            value={editionName}
            onChange={(e) => setEditionName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
