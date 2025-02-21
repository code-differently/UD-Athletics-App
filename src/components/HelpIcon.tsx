import { HelpCircle } from "lucide-react";

interface HelpIconProps {
  onClick: () => void;
}

export default function HelpIcon({ onClick }: HelpIconProps) {
  return (
    <button
      data-cy="help-icon"
      onClick={onClick}
      className="absolute top-[5px] left-[5px] bg-[#00539f] text-white w-6 h-6 rounded-full cursor-pointer flex items-center justify-center shadow-md text-base"
    >
      <HelpCircle className="h-4 w-4 text-white hover:text-gray-200" />
    </button>
  );
}
