// Import the HelpCircle icon component from the lucide-react library
import { HelpCircle } from "lucide-react";

// Summary for Developers:
// This React component, HelpIcon, is a simple, reusable UI element designed to display a clickable help icon. 
// It accepts an onClick function as a prop, enabling it to perform a specified action when clicked. 
// The component is styled using Tailwind CSS for precise positioning, sizing, and hover effects, 
// and it utilizes the HelpCircle icon from the lucide-react library. 
// This design pattern is common in component-based development, ensuring modularity and reusability across your application.

// Summary for Non-Developers:
// This piece of code creates a small, clickable help button that you might see on a website. 
// When you click the button, it triggers a specific action (like opening a help menu or guide). 
// The button is carefully styled to look good and is positioned at a specific spot on the screen. 
// Essentially, it’s a neat and tidy way to add a help feature to a webpage.

// Define the type of props this component expects.
// Here, it requires an onClick function which will be called when the icon is clicked.
interface HelpIconProps {
  onClick: () => void;
}

// This is a functional React component named HelpIcon that takes an onClick prop.
export default function HelpIcon({ onClick }: HelpIconProps) {
  return (
    // Render a button element with various attributes and styles.
    <button
      // data-cy attribute is typically used in testing (e.g., with Cypress) to select the element.
      data-cy="help-icon"
      // The onClick prop is assigned to handle click events on the button.
      onClick={onClick}
      // Tailwind CSS classes for positioning, color, size, shape, and layout.
      className="absolute top-[5px] left-[5px] bg-[#00539f] text-white w-6 h-6 rounded-full cursor-pointer flex items-center justify-center shadow-md text-base"
    >
      {/* Render the HelpCircle icon inside the button with its own styling.
          The icon changes color on hover due to the hover:text-gray-200 class. */}
      <HelpCircle className="h-4 w-4 text-white hover:text-gray-200" />
    </button>
  );
}
