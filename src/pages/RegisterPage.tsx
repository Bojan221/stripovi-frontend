import { useState } from "react";
import {
  registerSchema,
  type RegisterData,
  type RegisterErrors,
} from "../validation/registerSchema";
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
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});

    try {
      const response = await axiosPublic.post("/auth/registerUser", formData);
      showToast("success", response.data.message);
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err: any) {
      setLoading(false);
      showToast("error", err.response.data.message);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden py-8">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

      <div className="bg-white/95 backdrop-blur-lg flex flex-col lg:flex-row max-w-5xl w-[95%] rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative z-10">
        {/* Left Section - With Image */}
        <div className="hidden lg:flex flex-col justify-between p-8 gap-8 flex-1 bg-linear-to-br from-blue-50 to-slate-50">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black text-slate-950 leading-tight">
              Dobrodošli na
              <br />
              Stripovi.org
            </h1>
            <p className="text-base text-slate-700 font-medium leading-relaxed">
              Kreirajte svoju jedinstvenu kolekciju omiljenih stripova i pratite
              sve novitete iz svijeta stripa.
            </p>
          </div>
          <div className="h-80 rounded-xl overflow-hidden shadow-xl">
            <img
              src="src/assets/images/bonelli.png"
              alt="bonelli comics"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col py-8 px-6 md:px-10 gap-6 flex-1">
          <div className="lg:hidden flex flex-col gap-2">
            <h1 className="text-3xl font-black text-slate-950">Dobrodošli</h1>
            <p className="text-sm text-slate-600 font-medium">
              Kreirajte nalog i počnite sa vašom kolekcijom
            </p>
          </div>

          <h2 className="hidden lg:block text-3xl font-black text-slate-950">
            Registruj se
          </h2>

          <div className="flex flex-col gap-5">
            {/* First Name */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label
                  htmlFor="firstName"
                  className="text-xs font-bold uppercase text-slate-700 tracking-widest"
                >
                  Ime
                </label>
                {errors?.firstName && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.firstName[0]}
                  </p>
                )}
              </div>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                type="text"
                placeholder="Unesite vaše ime"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                  errors?.firstName && errors?.firstName.length > 0
                    ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                    : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
                }`}
              />
            </div>

            {/* Last Name */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label
                  htmlFor="lastName"
                  className="text-xs font-bold uppercase text-slate-700 tracking-widest"
                >
                  Prezime
                </label>
                {errors?.lastName && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.lastName[0]}
                  </p>
                )}
              </div>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                type="text"
                placeholder="Unesite vaše prezime"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                  errors?.lastName && errors?.lastName.length > 0
                    ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                    : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase text-slate-700 tracking-widest"
                >
                  Email
                </label>
                {errors?.email && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.email[0]}
                  </p>
                )}
              </div>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="vas@email.com"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                  errors?.email && errors?.email.length > 0
                    ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                    : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase text-slate-700 tracking-widest"
                >
                  Lozinka
                </label>
                {errors?.password && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.password[0]}
                  </p>
                )}
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                  errors?.password && errors?.password.length > 0
                    ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                    : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
                }`}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-end justify-between mb-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold uppercase text-slate-700 tracking-widest"
                >
                  Potvrda lozinke
                </label>
                {errors?.confirmPassword && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.confirmPassword[0]}
                  </p>
                )}
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                  errors?.confirmPassword && errors?.confirmPassword.length > 0
                    ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                    : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
                }`}
              />
            </div>
          </div>

          <button
            onClick={() => handleRegister()}
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2 tracking-wide mt-2"
          >
            {loading ? (
              <>
                <ImSpinner9 className="animate-spin w-5 h-5" />
                Učitavanje...
              </>
            ) : (
              "Registruj se"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600 font-semibold">
                ili
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-600 font-medium text-center">
              Već imate nalog?
            </p>
            <NavLink
              to={"/login"}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center active:scale-95 tracking-wide"
            >
              Prijava
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
