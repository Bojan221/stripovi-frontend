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

  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((v) => v !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  const getDisplayText = () => {
    if (selectedCount === 0) return placeholder;
    if (selectedCount === 1) {
      const selected = options.find((opt) => opt._id === value[0]);
      return selected?.name;
    }
    return `${selectedCount} odabrano`;
  };

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
          <span
            className={selectedCount > 0 ? "text-gray-700" : "text-gray-500"}
          >
            {getDisplayText()}
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
              {options.map((option) => (
                <label
                  key={option._id}
                  className="flex items-center w-full px-4 py-2 hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option._id)}
                    onChange={() => toggleOption(option._id)}
                    className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700">{option.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map((selectedId) => {
              const selectedOption = options.find(
                (opt) => opt._id === selectedId,
              );
              return (
                <div
                  key={selectedId}
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span>{selectedOption?.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleOption(selectedId)}
                    className="ml-1 hover:text-green-900 font-bold"
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
