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
    {
      id: "publisher",
      label: "Izdavači",
      path: "publisher",
      icon: MdLocalLibrary,
    },
    {
      id: "editions",
      label: "Edicije",
      path: "editions",
      icon: MdCollectionsBookmark,
    },
    { id: "characters", label: "Junaci", path: "characters", icon: MdPerson },
    { id: "comics", label: "Stripovi", path: "comics", icon: MdAutoStories },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-blue-100 text-base md:text-lg">
            Upravljanje sadržajem i korisnicima sistema
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 md:gap-2" aria-label="Admin tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 md:px-6 py-4 font-semibold whitespace-nowrap transition-all duration-300 relative border-b-2 ${
                      isActive
                        ? "text-blue-400 border-blue-400"
                        : "text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-600"
                    }`
                  }
                >
                  <Icon size={18} className="md:size-5" />
                  <span className="inline text-sm md:text-base">
                    {tab.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
