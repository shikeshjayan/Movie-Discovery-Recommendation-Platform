import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

const ConfirmModal = ({ open, title, message, onCancel, onConfirm }) => {
  const { theme } = useContext(ThemeContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className={`rounded-lg w-[90%] max-w-md p-6 shadow-lg
        ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }
        `}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:text-blue-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600  rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
