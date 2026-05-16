import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Početna", path: "/" },
  { label: "Stripovi", path: "/comics" },
  { label: "Moja Kolekcija", path: "/my-collection" },
  { label: "Lista Omiljenih", path: "/my-list" },
  { label: "Statistika", path: "/statistic" },
  { label: "Admin Panel", path: "/admin" },
];

const heroes = ["Zagor", "Dylan Dog", "Tex", "Martin Mystère", "Mister No", "Dampyr"];

function FooterComponent() {
  return (
    <footer className="bg-gray-950 border-t border-white/5">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand column */}
        <div className="flex flex-col gap-5">
          <NavLink to="/" className="flex items-center gap-2 w-fit group">
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center group-hover:bg-orange-400 transition-colors">
              <span className="text-white font-black text-xs leading-none">S</span>
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

        {/* Navigation column */}
        <div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-5">
            Navigacija
          </p>
          <ul className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors duration-150 ${
                      isActive ? "text-orange-400" : "text-white/50 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Heroes column */}
        <div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-5">
            Heroji
          </p>
          <ul className="flex flex-col gap-3">
            {heroes.map((hero) => (
              <li key={hero}>
                <span className="text-sm font-semibold text-white/50 hover:text-orange-400 transition-colors cursor-pointer">
                  {hero}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Stripovi. Sva prava zadržana.
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
