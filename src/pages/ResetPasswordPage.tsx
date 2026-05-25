import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordSchema, type ResetPasswordErrors } from "../validation/resetPasswordSchema";
import { axiosPublic } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import { ImSpinner9 } from "react-icons/im";

function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});
    try {
      await axiosPublic.post(`/auth/resetPassword/${token}`, { password });
      showToast("success", "Lozinka je uspješno promijenjena!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri resetovanju lozinke");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none font-medium text-gray-900";
  const inputNormal = `${inputBase} border-gray-200 bg-gray-50 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10`;
  const inputError = `${inputBase} border-red-400 bg-red-50 focus:border-red-500`;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col overflow-hidden">
      <div className="h-1.5 w-full bg-linear-to-r from-orange-400 via-red-500 to-orange-500 shrink-0" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

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
                <span className="block">NOVA</span>
                <span className="block text-orange-500">LOZINKA.</span>
              </h1>
              <p className="mt-8 text-white/35 text-sm leading-relaxed font-medium">
                Unesite novu lozinku za vaš nalog i potvrdite je.
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
          <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-center gap-8">
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-6 h-0.5 bg-orange-500" />
              <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
                Sergio Bonelli Editore
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-black text-gray-950 tracking-tight">Nova lozinka</h2>
              <p className="text-gray-400 text-sm mt-1.5 font-medium">
                Unesite i potvrdite novu lozinku
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Nova lozinka
                  </label>
                  {errors?.password && (
                    <p className="text-xs text-red-500 font-bold">{errors.password[0]}</p>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={errors?.password?.length ? inputError : inputNormal}
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Potvrda lozinke
                  </label>
                  {errors?.confirmPassword && (
                    <p className="text-xs text-red-500 font-bold">{errors.confirmPassword[0]}</p>
                  )}
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  placeholder="••••••••"
                  className={errors?.confirmPassword?.length ? inputError : inputNormal}
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-lg py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <><ImSpinner9 className="animate-spin w-5 h-5" />Čuvanje...</>
              ) : "Sačuvaj lozinku"}
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

            <NavLink
              to="/login"
              className="w-full bg-gray-950 hover:bg-gray-800 text-white font-black text-lg py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:scale-95 text-center"
            >
              Nazad na prijavu
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
