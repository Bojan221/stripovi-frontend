import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  loginSchema,
  type LoginData,
  type LoginErrors,
} from "../validation/loginSchema";
import { axiosPublic } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import { ImSpinner9 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    const result = loginSchema.safeParse(loginData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});

    try {
      const response = await axiosPublic.post("/auth/loginUser", loginData);
      dispatch(loginUser(response.data));
      setLoading(false);
      showToast("success", "Uspjesno ste se prijavili!");
      navigate("/");
    } catch (err: any) {
      showToast("error", err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

      <div className="bg-white/95 backdrop-blur-lg flex flex-col gap-8 p-8 md:p-12 rounded-2xl w-[90%] md:w-105 shadow-2xl border border-white/20 relative z-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">
            Prijava
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Pristupite vašoj kolekciji stripova
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-end mb-3">
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
              name="email"
              id="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, [e.target.name]: e.target.value })
              }
              placeholder="vas@email.com"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                errors?.email && errors?.email.length > 0
                  ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                  : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
              }`}
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-3">
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
              type="password"
              name="password"
              id="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, [e.target.name]: e.target.value })
              }
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                errors?.password && errors?.password.length > 0
                  ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                  : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
              }`}
            />
          </div>
        </div>

        <button
          onClick={() => handleLogin()}
          disabled={loading}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2 tracking-wide"
        >
          {loading ? (
            <>
              <ImSpinner9 className="h-5 w-5 animate-spin" />
              Učitavanje...
            </>
          ) : (
            "Prijava"
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
            Nemate nalog?
          </p>
          <NavLink
            to={"/register"}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center active:scale-95 tracking-wide"
          >
            Registracija
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
