import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Avatar from "../components/core/Avatar";
import {format} from "date-fns"; 
import LoadingIndicator from "../components/core/LoadingComponent";
import { axiosPrivate } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import { IoIosWarning } from "react-icons/io";

function MyAccountPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [settingPicture, setSettingPicture] = useState(false);
  

  useEffect(() => {
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  const handleUpdateProfilePicture = async () => {
    setSettingPicture(true); 
    const formData = new FormData();
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }
    try {
      const response = await axiosPrivate.put("/api/users/changeProfilePicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(response)
      setSettingPicture(false); 

    }catch(err:any) { 
      showToast("error", err.response?.data?.message || "Greska pri postavljanju profilne slike");
      setSettingPicture(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 ">
          <h1 className="text-4xl font-bold text-gray-900">Moj Nalog</h1>
          <p className="text-gray-600 mt-2">Upravljaj informacijama o svom nalogu</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200 relative">
            {/* Save Button */}
            {profilePictureFile && (
              <button
                onClick={handleUpdateProfilePicture}
                className="absolute top-0 right-0 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg cursor-pointer"
              >{
                  settingPicture ? <LoadingIndicator size={24} /> : "Sačuvaj"
              }
              </button>
            )}
            <div className="mb-6 relative group">
              <Avatar 
                firstName={user?.firstName || ""} 
                lastName={user?.lastName || ""} 
                profilePicture={profilePicturePreview || user?.profilePicture || undefined}
                size="xlarge" 
              />
              <label className="absolute -bottom-2 -right-2.5 bg-[#00000000] hover:bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:shadow-lg transition-colors group-hover:shadow-xl">
                <input
                  type="file"
                  onChange={(e) => {
                    if(e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setProfilePictureFile(file);
                      const previewUrl = URL.createObjectURL(file);
                      setProfilePicturePreview(previewUrl);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <svg className="w-6 h-6" fill="black" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H9.5v7H2.5v1h7v7h1v-7h7v-1h-7v-7z" />
                </svg>
              </label>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600 mt-3 px-4 py-1 bg-blue-100 rounded-full text-sm font-medium ">
              {user?.role === "admin" ? "Administrator" : "Korisnik"}
            </p>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                ID Korisnika
              </label>
              <p className="text-gray-900 font-mono text-sm break-all">
                {user?.id}
              </p>
            </div>

            {/* Role */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Uloga
              </label>
              <p className="text-gray-900 capitalize">
                {user?.role === "admin" ? "Administrator" : "Korisnik"}
              </p>
            </div>

            {/* Created Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Nalog Kreiran
              </label>
              <p className="text-gray-900">
                {user?.createdAt 
                  ? format(new Date(user.createdAt), "dd. MM. yyyy, HH:mm")
                  : "N/A"
                }
              </p>
            </div>

            {/* Updated Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Poslednja Promena
              </label>
              <p className="text-gray-900">
                {user?.updatedAt 
                  ? format(new Date(user.updatedAt), "dd. MM. yyyy, HH:mm")
                  : "N/A"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Lični Podaci</h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                isEditingProfile
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isEditingProfile ? "Otkaži" : "Izmeni"}
            </button>
          </div>

          {!isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Ime
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {user?.firstName}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Prezime
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {user?.lastName}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Ime
                </label>
                <input
                  type="text"
                  defaultValue={user?.firstName}
                  placeholder="Unesite ime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Prezime
                </label>
                <input
                  type="text"
                  defaultValue={user?.lastName}
                  placeholder="Unesite prezime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors">
                  Sačuvaj Promene
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Email Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Email Adresa</h3>
            <button
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                isEditingEmail
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isEditingEmail ? "Otkaži" : "Izmeni"}
            </button>
          </div>

          {!isEditingEmail ? (
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Email
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {user?.email}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Nova Email Adresa
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  placeholder="Unesite novu email adresu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                ℹ️ Na novu email adresu biće poslana link za potvrdu
              </p>
              <div className="pt-4 flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors">
                  Sačuvaj Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sigurnost</h3>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                isChangingPassword
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isChangingPassword ? "Otkaži" : "Promeni Šifru"}
            </button>
          </div>

          {!isChangingPassword ? (
            <div className="text-center py-4">
              <p className="text-gray-600">
                Kliknite na dugme iznad da promenite šifru
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Trenutna Šifra
                </label>
                <input
                  type="password"
                  placeholder="Unesite trenutnu šifru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Nova Šifra
                </label>
                <input
                  type="password"
                  placeholder="Unesite novu šifru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Potvrdi Novu Šifru
                </label>
                <input
                  type="password"
                  placeholder="Unesite novu šifru ponovo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
                <IoIosWarning className="w-7 h-7" color="orange" /> Šifra mora biti dugačka najmanje 8 karaktera
              </p>
              <div className="pt-4 flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors">
                  Promeni Šifru
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAccountPage;
