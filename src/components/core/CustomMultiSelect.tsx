import { useState, useRef, useEffect } from "react";

interface Option {
  _id: string;
  name: string;
}

interface CustomMultiSelectProps {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function CustomMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Odaberite opcije",
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedCount = value.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((v) => v !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  const getDisplayText = () => {
    if (selectedCount === 0) return placeholder;
    if (selectedCount === 1) return options.find((opt) => opt._id === value[0])?.name;
    return `${selectedCount} odabrano`;
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all cursor-pointer hover:border-gray-300 text-left flex justify-between items-center"
        >
          <span className={selectedCount > 0 ? "text-gray-900 font-semibold" : "text-gray-400"}>
            {getDisplayText()}
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
              {options.map((option) => (
                <label
                  key={option._id}
                  className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer gap-3"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option._id)}
                    onChange={() => toggleOption(option._id)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">{option.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map((selectedId) => {
              const selectedOption = options.find((opt) => opt._id === selectedId);
              return (
                <div
                  key={selectedId}
                  className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-bold"
                >
                  <span>{selectedOption?.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleOption(selectedId)}
                    className="hover:text-orange-900 font-black leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomMultiSelect;
