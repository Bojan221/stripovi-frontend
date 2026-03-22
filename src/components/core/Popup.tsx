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

function Popup({
  onClose,
  title,
  buttonText,
  children,
  onConfirm,
}: PopupProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirmButton = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-full overflow-hidden bg-[#00000060] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center bg-green-500 rounded-t-lg px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <IoClose
            size={32}
            fill="white"
            className="cursor-pointer hover:bg-green-600 rounded-full p-1 transition-colors"
            onClick={() => onClose()}
          />
        </div>
        {children}
        <div className="bg-gray-100 rounded-b-lg px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 cursor-pointer py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Otkaži
          </button>
          <button
            disabled={loading}
            className="px-6 cursor-pointer py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            onClick={() => handleConfirmButton()}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
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
