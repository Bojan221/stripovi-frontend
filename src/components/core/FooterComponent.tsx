import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../../api/axiosInstance";
import type { Hero } from "../../types/Hero";
import { showToast } from "../../utils/toast";
import { getYear } from "date-fns";

const navLinks = [
  { label: "Početna", path: "/" },
  { label: "Stripovi", path: "/comics" },
  { label: "Moja Kolekcija", path: "/my-collection" },
  { label: "Lista Omiljenih", path: "/my-list" },
  { label: "Statistika", path: "/statistic" },
  { label: "Admin Panel", path: "/admin" },
];

function FooterComponent() {
  const { data: heroData, error: errorData } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/heroes/getAllHeroes");
      return res.data.heroes as Hero[];
    },
    staleTime: Infinity,
  });
  
  if (errorData) showToast("error", "Greska pri ucitavanju heroja!");
  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-5">
          <NavLink to="/" onClick={()=> window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 w-fit group">
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center group-hover:bg-orange-400 transition-colors">
              <span className="text-white font-black text-xs leading-none">
                S
              </span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              STRIP<span className="text-orange-500">OVI</span>
            </span>
          </NavLink>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Tvoja digitalna biblioteka Sergio Bonelli stripova. Prati kolekciju,
            otkrivaj serijale i čuvaj omiljene heroje.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-0.5 bg-orange-500" />
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
              Sergio Bonelli Editore
            </span>
          </div>
        </div>

        <div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-5">
            Navigacija
          </p>
          <ul className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors duration-150 ${
                      isActive
                        ? "text-orange-400"
                        : "text-white/50 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-5">
            Heroji
          </p>
          <ul className="flex flex-col gap-3">
            {heroData?.map((hero) => (
              <li key={hero._id}>
                <NavLink
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  to={`/comics?hero=${hero._id}`}
                  className="text-sm font-semibold text-white/50 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {hero.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {getYear(new Date())} Stripovi. Sva prava zadržana.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white/25 text-xs ml-1">
              Napravljeno s ljubavlju prema stripu
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
