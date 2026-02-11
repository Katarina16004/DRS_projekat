import toast from "react-hot-toast";

export function confirmDelete(message: string, onYes: () => void, onNo?: () => void) {
  const toastId = toast.custom((t) => (
    <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center gap-4 border border-red-200">
      <div className="text-lg font-semibold text-gray-800 text-center">{message}</div>
      <div className="flex gap-4">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onYes();
          }}
          className="bg-red-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-600 transition cursor-pointer"
        >
          Yes
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            if (onNo) onNo();    // <-- Ovde je ispravljeno!
          }}
          className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 font-semibold hover:bg-gray-400 transition cursor-pointer"
        >
          No
        </button>
      </div>
    </div>
  ), { id: "delete-confirm" });
  return toastId;
}