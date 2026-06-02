import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosPrivate } from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { showToast } from "../../utils/toast";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Avatar from "./Avatar";

function HeaderComponent() {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigator = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosPrivate.post(
        "/auth/logoutUser",
        {},
        { withCredentials: true },
      );
    } catch {
      showToast("error", "Greška pri odjavljivanju");
    } finally {
      dispatch(logoutUser());
      showToast("success", "Uspješno ste se odjavili");
    }
  };

  const navItems = [
    { label: "Početna", path: "/",role:"user" },
    { label: "Stripovi", path: "/comics",role:"user" },
    { label: "Moja Kolekcija", path: "/my-collection",role:"user" },
    { label: "Lista Omiljenih", path: "/my-list",role:"user" },
    { label: "Statistika", path: "/statistic" ,role:"user" },
    { label: "Admin Panel", path: "/admin", role: "admin" },
  ];
  console.log(user);
  return (
    <>
      <header className="w-full bg-gray-950 sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <NavLink
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center group-hover:bg-orange-400 transition-colors">
              <span className="text-white font-black text-xs leading-none">
                S
              </span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              STRIP<span className="text-orange-500">OVI</span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.role === 'admin' && user?.role !== "admin") return
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-semibold transition-colors duration-150 rounded-lg ${
                      isActive
                        ? "text-orange-400"
                        : "text-white/60 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 ">
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <Avatar
                  firstName={user?.firstName || ""}
                  lastName={user?.lastName || ""}
                  profilePicture={user?.profilePicture || ""}
                  size="small"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-white text-sm font-semibold leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5 leading-none">
                    {user?.email}
                  </p>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-white/40 transition-transform ${showOptions ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showOptions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowOptions(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-semibold cursor-pointer text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => {
                        navigator("/my-account");
                        setShowOptions(false);
                      }}
                    >
                      Moj Profil
                    </button>
                    <div className="h-px bg-white/10" />
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-semibold cursor-pointer text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      onClick={() => {
                        handleLogout();
                        setShowOptions(false);
                      }}
                    >
                      Odjava
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden text-white/70 hover:text-white transition-colors p-1"
            >
              <HiBars3 size={26} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMobileMenu(false)}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 w-72 bg-gray-950 border-l border-white/10 z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="text-white font-black tracking-tight">
            STRIP<span className="text-orange-500">OVI</span>
          </span>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <HiXMark size={22} />
          </button>
        </div>

        <button
          className="flex items-center gap-3 px-5 py-4 border-b border-white/10 hover:bg-white/5 transition-colors text-left"
          onClick={() => {
            navigator("/my-account");
            setShowMobileMenu(false);
          }}
        >
          <Avatar
            firstName={user?.firstName || ""}
            lastName={user?.lastName || ""}
            profilePicture={user?.profilePicture || ""}
            size="medium"
          />
          <div>
            <p className="text-white font-bold text-sm">
              {user ? `${user.firstName} ${user.lastName}` : "Korisnik"}
            </p>
            <p className="text-white/40 text-xs mt-0.5">{user?.email}</p>
          </div>
        </button>

        {/* Nav items */}
        <nav className="flex flex-col px-3 py-3 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setShowMobileMenu(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-orange-500" : "bg-white/20"}`}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <button
            onClick={() => {
              handleLogout();
              setShowMobileMenu(false);
            }}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Odjava
          </button>
        </div>
      </div>
    </>
  );
}

export default HeaderComponent;
