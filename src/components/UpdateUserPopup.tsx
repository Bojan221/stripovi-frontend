import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";
import LoadingIndicator from "./core/LoadingComponent";
import { showToast } from "../utils/toast";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Popup from "./core/Popup";
interface PopupProps {
  onClose: () => void;
  userId: string;
  fetch: () => void;
}
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
        const response = await axiosPrivate.get(
          `/api/users/getUserById/${userId}`,
        );
        const user = response.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setRole(user.role);
      } catch (err) {
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
      showToast("success", "Korisnik uspešno ažuriran");
      onClose();

      fetch();
    } catch (err: any) {
      showToast(
        "error",
        err.response?.data?.message || "Greška pri ažuriranju",
      );
    }
  };

  return (
    <Popup
      title="Ažuriraj korisnika"
      buttonText="Ažuriraj"
      onConfirm={handleSave}
      onClose={onClose}
    >
      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="px-6 py-6 space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ime
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Unesite ime"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prezime
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Unesite prezime"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Unesite email"
            />
          </div>

          {/* Role */}
          {currentUser?.role === "admin" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Uloga
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "user" | "moderator" | "admin")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              >
                <option value="user">User</option>
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
