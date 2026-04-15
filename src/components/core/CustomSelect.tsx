import { useState, useRef, useEffect } from "react";

interface Option {
  _id: string;
  name: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Odaberite opciju",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((opt) => opt._id === value)?.name || placeholder;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white cursor-pointer hover:border-gray-400 text-left flex justify-between items-center"
        >
          <span className={value ? "text-gray-700" : "text-gray-500"}>
            {selectedLabel}
          </span>
          <svg
            className={`fill-current h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="max-h-60 overflow-y-auto">
              {options.length === 0? (
                <p className="px-3 py-2 text-slate-500">Nema Podataka</p>
              ): (
                options.map((option) => (
                  <button
                  key={option._id}
                  type="button"
                  onClick={() => {
                    onChange(option._id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-green-100 transition-colors ${
                    value === option._id ? "bg-green-200 font-semibold" : ""
                    }`}
                    >
                    {option.name}
                    </button>
                  ))
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomSelect;
