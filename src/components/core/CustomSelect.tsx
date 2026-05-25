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
  disabled?:boolean;
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Odaberite opciju",
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => opt._id === value)?.name || placeholder;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all text-left flex justify-between items-center ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}`}
        >
          <span className={value ? "text-gray-900 font-semibold" : "text-gray-400"}>
            {selectedLabel}
          </span>
          <svg
            className={`fill-current h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <p className="px-4 py-3 text-gray-400 text-sm">Nema podataka</p>
              ) : (
                options.map((option) => (
                  <button
                    key={option._id}
                    type="button"
                    onClick={() => {
                      onChange(option._id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      value === option._id
                        ? "bg-orange-50 text-orange-600 font-bold"
                        : "text-gray-700 hover:bg-gray-50"
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
