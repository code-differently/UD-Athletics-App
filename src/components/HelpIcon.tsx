import { HelpCircle } from "lucide-react"

interface HelpIconProps {
  onClick: () => void
}

export default function HelpIcon({ onClick }: HelpIconProps) {
  return (
    <button
      data-cy="help-icon"
      onClick={onClick}
      className="relative bottom-0 right-0 bg-white p-2 rounded-full shadow-lg"
    >
      <HelpCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
    </button>
  )
}

