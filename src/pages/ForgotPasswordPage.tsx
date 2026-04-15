import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  forgotPasswordSchema,
  type ForgotPasswordData,
  type ForgotPasswordErrors,
} from "../validation/forgotPasswordSchema";
import { axiosPublic } from "../api/axiosInstance";
import { showToast } from "../utils/toast";
import { ImSpinner9 } from "react-icons/im";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});

    try {
      await axiosPublic.post("/auth/forgotPassword", { email });
      setLoading(false);
      setSubmitted(true);
      showToast("success", "Link za resetovanje lozinke poslat na vašu email adresu!");
      setEmail("");
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri slanju emaila");
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
            Resetuj Lozinku
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Unesite vašu email adresu i posaljite zahtjev za resetovanje
          </p>
        </div>

        {!submitted ? (
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
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                placeholder="vas@email.com"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none font-medium ${
                  errors?.email && errors?.email.length > 0
                    ? "border-red-500 bg-red-50/50 focus:bg-white focus:border-red-600"
                    : "border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/20"
                }`}
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2 tracking-wide"
            >
              {loading ? (
                <>
                  <ImSpinner9 className="h-5 w-5 animate-spin" />
                  Slanje...
                </>
              ) : (
                "Pošalji Link"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium text-center">
                ✓ Email je uspješno poslat! Provjerite vašu email adresu za link za resetovanje lozinke.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center active:scale-95 tracking-wide"
            >
              Pošalji Again
            </button>
          </div>
        )}

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

        <div className="flex flex-col gap-3">
          <NavLink
            to={"/login"}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center active:scale-95 tracking-wide"
          >
            Nazad na Prijavu
          </NavLink>
          <NavLink
            to={"/register"}
            className="w-full text-center text-sm text-slate-600 hover:text-blue-500 transition-all duration-200 font-medium"
          >
            Nemate nalog? Registrujte se
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;