import { useState } from "react";
import { registerSchema, type RegisterData, type RegisterErrors } from "../validation/registerSchema";
import { NavLink } from "react-router-dom";
import { axiosPublic } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { ImSpinner9 } from "react-icons/im";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});
    try {
      const response = await axiosPublic.post("/auth/registerUser", formData);
      showToast("success", response.data.message);
      setTimeout(() => navigate("/login"), 500);
    } catch (err: any) {
      showToast("error", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputBase = "w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none font-medium text-gray-900";
  const inputNormal = `${inputBase} border-gray-200 bg-gray-50 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10`;
  const inputError = `${inputBase} border-red-400 bg-red-50 focus:border-red-500`;

  const field = (key: keyof RegisterData) =>
    errors?.[key]?.length ? inputError : inputNormal;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col overflow-hidden">
      <div className="h-1.5 w-full bg-linear-to-r from-orange-400 via-red-500 to-orange-500 shrink-0" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

          {/* Left branding panel */}
          <div className="hidden lg:flex flex-col justify-between bg-gray-900 p-12 w-88 shrink-0 border-r border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-14">
                <div className="w-8 h-0.5 bg-orange-500" />
                <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.25em]">
                  Sergio Bonelli Editore
                </span>
              </div>
              <h1 className="text-[3.5rem] font-black leading-[0.9] tracking-tight text-white">
                <span className="block">REGISTRUJ</span>
                <span className="block text-orange-500">SE.</span>
              </h1>
              <p className="mt-8 text-white/35 text-sm leading-relaxed font-medium">
                Kreirajte nalog i počnite graditi svoju kolekciju Bonelli stripova.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 space-y-5">
              {[
                { num: "500+", label: "Stripova" },
                { num: "20+", label: "Serijala" },
                { num: "10+", label: "Heroja" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-white">{s.num}</span>
                  <span className="text-white/30 text-xs uppercase tracking-widest font-bold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center gap-7">
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-6 h-0.5 bg-orange-500" />
              <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
                Sergio Bonelli Editore
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-black text-gray-950 tracking-tight">Registracija</h2>
              <p className="text-gray-400 text-sm mt-1.5 font-medium">
                Kreirajte nalog i počnite sa vašom kolekcijom
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Ime i prezime u redu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Ime</label>
                    {errors?.firstName && (
                      <p className="text-xs text-red-500 font-bold">{errors.firstName[0]}</p>
                    )}
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Vaše ime"
                    className={field("firstName")}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Prezime</label>
                    {errors?.lastName && (
                      <p className="text-xs text-red-500 font-bold">{errors.lastName[0]}</p>
                    )}
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Vaše prezime"
                    className={field("lastName")}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                  {errors?.email && (
                    <p className="text-xs text-red-500 font-bold">{errors.email[0]}</p>
                  )}
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vas@email.com"
                  className={field("email")}
                />
              </div>

              {/* Lozinka i potvrda u redu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Lozinka</label>
                    {errors?.password && (
                      <p className="text-xs text-red-500 font-bold">{errors.password[0]}</p>
                    )}
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={field("password")}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Potvrda</label>
                    {errors?.confirmPassword && (
                      <p className="text-xs text-red-500 font-bold">{errors.confirmPassword[0]}</p>
                    )}
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                    type="password"
                    placeholder="••••••••"
                    className={field("confirmPassword")}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-lg py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <><ImSpinner9 className="animate-spin w-5 h-5" />Učitavanje...</>
              ) : "Registruj se"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-gray-400 text-xs font-bold uppercase tracking-widest">
                  ili
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-medium text-center">Već imate nalog?</p>
              <NavLink
                to="/login"
                className="w-full bg-gray-950 hover:bg-gray-800 text-white font-black text-lg py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:scale-95 text-center"
              >
                Prijava
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
