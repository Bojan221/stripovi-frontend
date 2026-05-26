import heroBg from "../assets/images/herosection.png";
import { axiosPrivate } from "../api/axiosInstance";
import type { Hero } from "../types/Hero";
import { IoLibrary } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "../utils/toast";

function HomePage() {

  const {data: heroData, error: errorData} = useQuery({
    queryKey:["hero"],
    queryFn: async () => { 
      const res = await axiosPrivate.get("/api/heroes/getAllHeroes")
      return res.data.heroes as Hero[]
    },
    staleTime: Infinity
  })

  if(errorData) showToast("error","Greska pri ucitavanju heroja!")

  const tickerItems =heroData? heroData.length > 0 ? [...heroData, ...heroData] : [] : [];

  return ( 
    <div className="min-h-screen bg-white overflow-x-hidden">

      <div className="h-1.5 w-full bg-linear-to-r from-orange-400 via-red-500 to-orange-500" />

      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-0">

          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-0.5 bg-orange-500" />
            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.25em]">
              Sergio Bonelli Editore
            </span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">

            <div className="flex-1">
              <h1 className="text-[clamp(2.8rem,6vw,6rem)] font-black leading-[0.9] tracking-tight text-gray-950">
                <span className="block">KOLEKCIJA</span>
                <span className="block text-orange-500">STRIPOVA</span>
              </h1>

              <p className="mt-8 text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg">
                Pregledaj hiljade Bonelli stripova, prati serijale i organizuj
                svoju biblioteku na jednom mjestu.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <button className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg cursor-pointer font-bold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5">
                  Istrazi Stripove
                </button>
                <button className="text-gray-900 font-bold text-sm sm:text-lg px-5 py-2.5 sm:px-8 sm:py-4 border-2 border-gray-900 cursor-pointer rounded-xl hover:bg-gray-900 hover:text-white active:scale-95 transition-all duration-200">
                  Moja Kolekcija
                </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-col text-right shrink-0">
              {[
                { num: "500+", label: "Stripova" },
                { num: "20+", label: "Serija" },
                { num: "10+", label: "Heroja" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="py-6">
                    <div className="text-[3.5rem] leading-none font-black text-gray-950">
                      {stat.num}
                    </div>
                    <div className="text-gray-400 font-semibold text-sm uppercase tracking-widest mt-1">
                      {stat.label}
                    </div>
                  </div>
                  {i < 2 && <div className="w-full h-px bg-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="absolute top-0 left-0 right-0 h-8 sm:h-24 bg-linear-to-b from-white via-white/60 to-transparent z-10 pointer-events-none" />
          <img
            src={heroBg}
            alt="Bonelli Heroes"
            className="w-full md:w-[90%] object-cover select-none mx-auto"
            draggable={false}
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-gray-950 to-transparent pointer-events-none" />
        </div>

        <div className="bg-gray-950 py-5 overflow-hidden">
          {tickerItems.length > 0 ? (
            <div
              className="flex whitespace-nowrap"
              style={{ animation: "ticker-ltr 25s linear infinite" }}
            >
              {tickerItems.map((hero, i) => (
                <span
                  key={`${hero._id}-${i}`}
                  className="text-white/40 hover:text-orange-400 transition-colors text-xs font-bold uppercase tracking-[0.2em] cursor-pointer px-6 shrink-0"
                >
                  {hero.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-orange-500" />
            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
              Funkcije
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 mb-16">
            Sve na jednom
            <br />
            <span className="text-orange-500">mjestu.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <IoLibrary color="red"/>,
                title: "Biblioteka",
                desc: "Pregledaj kompletnu kolekciju Bonelli stripova sortirano po seriji, heroju ili ediciji.",
              },
              {
                icon: <FaStar color="yellow"/>,
                title: "Kolekcija",
                desc: "Dodaj stripove u svoju osobnu kolekciju i prati koje primjerke posjedujes.",
              },
              {
                icon: <FaSearch />,
                title: "Pretraga",
                desc: "Pronadji bilo koji strip po naslovu, heroju, izdavacu ili broju izdanja.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-black text-gray-950 mb-3 group-hover:text-orange-500 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-4 border-white rounded-full"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Pocni graditi
            <br />
            svoju kolekciju.
          </h2>
          <button className="bg-white text-orange-500 hover:bg-gray-100 active:scale-95 font-black text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-xl">
            Kreni Odmah
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
