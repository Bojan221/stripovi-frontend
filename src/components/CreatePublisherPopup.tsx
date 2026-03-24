import { useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import Popup from "./core/Popup";
import type { Publisher } from "../types/Publisher";
interface PopupProps {
  onClose: () => void;
  fetch: () => void;
  update?: boolean;
  updateData?: Publisher;
}
function CreatePublisherPopup({
  onClose,
  fetch,
  update = false,
  updateData,
}: PopupProps) {
  const [name, setName] = useState(updateData?.name || "");
  const [country, setCountry] = useState(updateData?.country || "");
  const createPublisher = async () => {
    try {
      const endpoint = update
        ? `/api/publishers/updatePublisher/${updateData?._id}`
        : "/api/publishers/createPublisher";
      if (!name) {
        showToast("error", "Ime izdavača je obavezno!");
        return;
      }
      if (!country) {
        showToast("error", "Država je obavezna!");
        return;
      }
      const publisher = {
        name,
        country,
      };
      await axiosPrivate.post(endpoint, publisher);
        fetch();
        onClose();
        const message = update
          ? "Uspješno ažuriran izdavač"
          : "Uspješno kreiran izdavač";
        return showToast("success", message);
      
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri kreiranju ili ažuriranju izdavača");
    }
  };

  return (
    <Popup
      title={update ? "Ažuriraj Izdavača" : "Kreiraj Izdavača"}
      onClose={onClose}
      onConfirm={createPublisher}
      buttonText={update ? "Ažuriraj" : "Kreiraj"}
    >
      <div className="px-6 py-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Izdavač
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Unesite naziv izdavača"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Država
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Unesite naziv države"
          />
        </div>
      </div>
    </Popup>
  );
}

export default CreatePublisherPopup;
