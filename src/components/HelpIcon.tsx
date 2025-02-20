import { HelpCircle } from "lucide-react"

interface HelpIconProps {
  onClick: () => void
}

export default function HelpIcon({ onClick }: HelpIconProps) {
  return (
    <button
      data-cy="help-icon"
      onClick={onClick}
      className="absolute bottom-0 right-0 flex items-end justify-end bg-white p-2 rounded-full shadow-lg"
    >
      <HelpCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
    </button>
  )
}

