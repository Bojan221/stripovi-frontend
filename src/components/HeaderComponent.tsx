import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { axiosPrivate } from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { showToast } from "../utils/toast";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

function HeaderComponent() {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosPrivate.post(
        "/auth/logoutUser",
        {},
        { withCredentials: true },
      );
    } catch (err) {
      showToast("error", "Greska pri odjavljivanju");
      console.log(err);
    } finally {
      dispatch(logoutUser());
      showToast("success", "Uspjesno ste se odjavili");
    }
  };

  const navItems = [
    { label: "POČETNA", path: "/" },
    { label: "MOJA KOLEKCIJA", path: "/my-collection" },
    { label: "LISTA OMILJENIH", path: "/my-list" },
    { label: "STATISTIKA", path: "/statistic" },
    { label: "ADMIN PANEL", path: "/admin" },
  ];

  return (
    <div className="w-full border-b border-blue-900 shadow-md shadow-black bg-slate-700 sticky top-0 z-40">
      <div className="flex justify-between items-center py-3 px-5">
        {/* Logo Section */}
        <NavLink
          to="/"
          className="flex items-center gap-2 md:hidden hover:opacity-80 transition-opacity"
        >
          {/* SVG Comic Icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
          >
            {/* Left Comic Panel */}
            <rect
              x="2"
              y="4"
              width="15"
              height="15"
              rx="1"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="6" cy="8" r="2" fill="white" />
            <rect x="6" y="12" width="6" height="2" fill="white" />

            {/* Right Comic Panel */}
            <rect
              x="23"
              y="4"
              width="15"
              height="15"
              rx="1"
              fill="#F59E0B"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="27" cy="8" r="2" fill="white" />
            <rect x="27" cy="12" width="6" height="2" fill="white" />

            {/* Bottom Comic Panel */}
            <rect
              x="2"
              y="21"
              width="36"
              height="15"
              rx="1"
              fill="#8B5CF6"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="6" cy="25" r="2" fill="white" />
            <rect x="6" cy="29" width="28" height="2" fill="white" />

            {/* Comic Boom Star */}
            <polygon
              points="37,12 39,18 46,19 41,24 42,31 37,27 32,31 33,24 28,19 35,18"
              fill="#EF4444"
              opacity="0.8"
            />
          </svg>

          {/* Text */}
          <span className="block text-white font-bold text-sm sm:text-base tracking-wide">
            STRIPOVI
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-4 md:gap-6 items-center bg-white px-4 py-2 rounded-lg shadow-sm">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Profile & Hamburger */}
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {/* User Avatar - Hidden on Mobile */}
          <div className="relative hidden md:block">
            <div
              className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 font-bold text-lg rounded-full shadow-md"
              onClick={() => setShowOptions(!showOptions)}
            >
              {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
            </div>
            {showOptions && (
              <div className="absolute right-0 mt-2 shadow-lg w-44 rounded-md bg-white flex flex-col z-50">
                <button className="text-md font-semibold hover:bg-slate-200 transition-all duration-200 px-4 py-2 text-left">
                  Moj Profil
                </button>
                <button
                  className="text-md font-semibold hover:bg-slate-200 transition-all duration-200 px-4 py-2 text-left"
                  onClick={handleLogout}
                >
                  Odjava
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white text-2xl"
          >
            {showMobileMenu ? <HiXMark /> : <HiBars3 size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed inset-0 bg-[#00000096]  transition-opacity duration-300 ease-in-out md:hidden ${
          showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMobileMenu(false)}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 w-72 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User Info Section at Top */}
        <div className="bg-blue-400 px-5 py-6 flex items-center gap-4 relative">
          <div className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 font-bold text-lg rounded-full shadow-md">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
          </div>
          <div className="text-white">
            <p className="font-bold">
              {user ? `${user.firstName} ${user.lastName}` : "Korisnik"}
            </p>
            <p className="text-sm text-blue-100">{user?.email}</p>
          </div>
          <div
            className="absolute top-1 right-2  text-white font-semibold"
            onClick={() => setShowMobileMenu(false)}
          >
            <IoClose size={24} />
          </div>
        </div>

        {/* Navigation List */}
        <ul className="flex flex-col mt-4 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-200 hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={() => {
            handleLogout();
            setShowMobileMenu(false);
          }}
          className="m-4 w-[calc(100%-2rem)] bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Odjava
        </button>
      </div>
    </div>
  );
}

export default HeaderComponent;
