const ConfirmationModal = ({ open, onConfirm, onCancel, title, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded w-80 text-center">
        <h3 className="text-lg font-bold mb-2">
          {title}
        </h3>

        <p className="text-sm mb-4">
          {message}
        </p>

        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-neutral-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
