import { useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import Popup from "./core/Popup";
interface PopupProps {
  onClose: () => void;
  fetch: () => void;
}
function CreatePublisherPopup({ onClose, fetch }: PopupProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const createPublisher = async () => {
    try {
      if (!name) {
        showToast("error", "Ime izdavača je obavezno!");
        return;
      }
      if (!country) {
        showToast("error", "Država je obavezna!");
      }

      const publisher = {
        name,
        country,
      };
      const response = await axiosPrivate.post(
        "/api/publishers/createPublisher",
        publisher,
      );
      if (response.status === 200) {
        fetch();
        onClose();
        return showToast("success", "Uspješno kreiran izdavač");
      } else {
        return showToast("error", "Greška pri kreiranju izdavača");
      }
    } catch (err: any) {
      showToast("error", err.response.data.message);
    }
  };

  return (
    <Popup
      title="Kreiraj Izdavača"
      onClose={onClose}
      onConfirm={createPublisher}
      buttonText="Kreiraj"
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
            type="email"
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
