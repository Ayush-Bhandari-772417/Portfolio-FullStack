// admin\src\components\FormActions.tsx
import { FiSave } from "react-icons/fi";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

export default function FormActions({ loading, onCancel }: FormActionsProps) {
  const handleCancel = () => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    onCancel();
  };

  return (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={handleCancel}
        className="px-4 py-2 rounded-md border bg-white"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-indigo-600 text-white flex items-center"
        disabled={loading}
      >
        <FiSave className="mr-2" />
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}