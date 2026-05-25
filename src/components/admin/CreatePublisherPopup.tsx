import { useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import Popup from "./../core/Popup";
import type { Publisher } from "../../types/Publisher";

interface PopupProps {
  onClose: () => void;
  fetch: () => void;
  update?: boolean;
  updateData?: Publisher;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400 text-gray-900";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

function CreatePublisherPopup({ onClose, fetch, update = false, updateData }: PopupProps) {
  const [name, setName] = useState(updateData?.name || "");
  const [country, setCountry] = useState(updateData?.country || "");

  const createPublisher = async () => {
    if (!name) return showToast("error", "Ime izdavača je obavezno!");
    if (!country) return showToast("error", "Država je obavezna!");

    try {
      const endpoint = update
        ? `/api/publishers/updatePublisher/${updateData?._id}`
        : "/api/publishers/createPublisher";
      await axiosPrivate.post(endpoint, { name, country });
      fetch();
      onClose();
      showToast("success", update ? "Uspješno ažuriran izdavač" : "Uspješno kreiran izdavač");
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri kreiranju ili ažuriranju izdavača");
    }
  };

  return (
    <Popup
      title={update ? "Ažuriraj Izdavača" : "Dodaj Izdavača"}
      onClose={onClose}
      onConfirm={createPublisher}
      buttonText={update ? "Sačuvaj" : "Kreiraj"}
    >
      <div className="px-6 py-6 space-y-5">
        <div>
          <label className={labelClass}>Naziv izdavača</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Unesite naziv izdavača"
          />
        </div>
        <div>
          <label className={labelClass}>Država</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
            placeholder="Unesite naziv države"
          />
        </div>
      </div>
    </Popup>
  );
}

export default CreatePublisherPopup;
