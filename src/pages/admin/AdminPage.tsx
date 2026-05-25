import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  MdPeople,
  MdLocalLibrary,
  MdCollectionsBookmark,
  MdPerson,
  MdAutoStories,
} from "react-icons/md";

function AdminPage() {
  const tabs = [
    { id: "users", label: "Korisnici", path: "users", icon: MdPeople },
    { id: "publisher", label: "Izdavači", path: "publisher", icon: MdLocalLibrary },
    { id: "editions", label: "Edicije", path: "editions", icon: MdCollectionsBookmark },
    { id: "characters", label: "Junaci", path: "characters", icon: MdPerson },
    { id: "comics", label: "Stripovi", path: "comics", icon: MdAutoStories },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange accent bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-orange-400 via-red-500 to-orange-500" />

      {/* Header */}
      <div className="bg-gray-950 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-orange-500" />
            <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
              Upravljanje sistemom
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Admin <span className="text-orange-500">Panel</span>
          </h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-950 border-t border-white/10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-0" aria-label="Admin tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-5 py-4 font-bold whitespace-nowrap transition-all duration-200 relative border-b-2 text-sm uppercase tracking-wide ${
                      isActive
                        ? "text-orange-500 border-orange-500"
                        : "text-white/40 hover:text-white/80 border-transparent"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
