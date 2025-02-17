import { XCircle } from "lucide-react"

interface HelpAffordanceProps {
  onClose: () => void
}

export default function HelpAffordance({ onClose }: HelpAffordanceProps) {
  return (
    <div data-cy="help-affordance" className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
      <button data-cy="help-close-btn" onClick={onClose} className="absolute bottom-0 right-0">
        <XCircle className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </button>
      <p className="text-gray-800">Interact with the avatar to learn more</p>
    </div>
  )
}

