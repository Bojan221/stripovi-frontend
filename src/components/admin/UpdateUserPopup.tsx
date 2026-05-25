import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import LoadingIndicator from "../core/LoadingComponent";
import { showToast } from "../../utils/toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Popup from "../core/Popup";

interface PopupProps {
  onClose: () => void;
  userId: string;
  fetch: () => void;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400 text-gray-900";
const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

function UpdateUserPopup({ onClose, userId, fetch }: PopupProps) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "moderator" | "admin">("user");
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(`/api/users/getUserById/${userId}`);
        const user = response.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setRole(user.role);
      } catch {
        showToast("error", "Greška pri učitavanju korisnika");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast("error", "Sva polja su obavezna");
      return;
    }
    try {
      await axiosPrivate.post(`/api/users/updateUser/${userId}`, {
        firstName,
        lastName,
        email,
        role,
      });
      showToast("success", "Korisnik uspješno ažuriran");
      onClose();
      fetch();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri ažuriranju");
    }
  };

  return (
    <Popup title="Ažuriraj Korisnika" buttonText="Sačuvaj" onConfirm={handleSave} onClose={onClose}>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ime</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                placeholder="Unesite ime"
              />
            </div>
            <div>
              <label className={labelClass}>Prezime</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                placeholder="Unesite prezime"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="Unesite email"
            />
          </div>

          {currentUser?.role === "admin" && (
            <div>
              <label className={labelClass}>Uloga</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "moderator" | "admin")}
                className={inputClass}
              >
                <option value="user">Korisnik</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>
      )}
    </Popup>
  );
}

export default UpdateUserPopup;
