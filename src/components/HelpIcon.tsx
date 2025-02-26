import { HelpCircle } from "lucide-react";

interface HelpIconProps {
  /** Function to handle click events on the help icon */
  onClick: () => void;
}

/**
 * A reusable help icon button. 
 * When clicked, it triggers the provided onClick function.
 */
export default function HelpIcon({ onClick }: HelpIconProps) {
  return (
    <button
      data-cy="help-icon" // Used for automated testing
      onClick={onClick}
      className="absolute top-[5px] left-[5px] bg-[#00539f] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md text-base hover:text-gray-200"
    >
      <HelpCircle className="h-4 w-4" />
    </button>
  );
}
