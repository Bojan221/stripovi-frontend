import React from "react";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

interface PopupProps {
  title: string;
  buttonText: string;
  onConfirm: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

function Popup({ onClose, title, buttonText, children, onConfirm }: PopupProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirmButton = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-950 rounded-t-2xl px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-4 h-0.5 bg-orange-500" />
            <h1 className="text-lg font-black text-white tracking-tight">{title}</h1>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <IoClose size={22} className="text-white/70 hover:text-white transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 rounded-b-2xl px-6 py-4 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 font-bold text-sm border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Otkaži
          </button>
          <button
            disabled={loading}
            onClick={handleConfirmButton}
            className="px-5 py-2.5 bg-gray-950 hover:bg-gray-800 text-white font-bold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
