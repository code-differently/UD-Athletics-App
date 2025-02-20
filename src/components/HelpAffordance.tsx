import { XCircle } from "lucide-react";

interface HelpAffordanceProps {
  onClose: () => void;
}

export default function HelpAffordance({ onClose }: HelpAffordanceProps) {
  return (
    <div
      data-cy="help-affordance"
      className="fixed top-[10px] left-[10px] bg-[#00539f] text-white p-4 rounded-md shadow-lg w-[200px] flex flex-col items-center"
    >
      <p className="text-sm text-white text-center">This is help text for the avatar scene.</p>
      <button
        data-cy="help-close-btn"
        onClick={onClose}
        className="mt-2 flex items-center justify-center bg-transparent border-none cursor-pointer"
      >
        <XCircle className="h-5 w-5 text-white hover:text-gray-200" />
      </button>
    </div>
  );
}
