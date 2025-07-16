// Utility function for conditional class name merging
import { cn } from "@/lib/utils";

/**
 * Props interface for LoadingSpinner component
 * 
 * @interface LoadingSpinnerProps
 * @property {"sm" | "md" | "lg"} [size="md"] - Size variant of the spinner
 * @property {string} [className] - Additional CSS classes to apply
 */
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"; // Optional size prop with predefined variants
  className?: string; // Optional additional CSS classes
}

/**
 * LoadingSpinner Component
 * 
 * A reusable loading spinner component with customizable size and styling.
 * Features:
 * - Three size variants: sm (16x16px), md (24x24px), lg (32x32px)
 * - Smooth CSS animation using Tailwind's animate-spin
 * - Customizable styling through className prop
 * - Accessible design with proper contrast
 * - Lightweight and performant
 * 
 * @param {LoadingSpinnerProps} props - Component props
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Size of the spinner
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Rendered loading spinner
 * 
 * @example
 * // Basic usage with default medium size
 * <LoadingSpinner />
 * 
 * @example
 * // Small spinner with custom styling
 * <LoadingSpinner size="sm" className="text-blue-500" />
 * 
 * @example
 * // Large spinner for prominent loading states
 * <LoadingSpinner size="lg" className="mx-auto" />
 */
const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  /**
   * Size class mappings for different spinner variants
   * - sm: 16x16 pixels (w-4 h-4)
   * - md: 24x24 pixels (w-6 h-6) - default
   * - lg: 32x32 pixels (w-8 h-8)
   */
  const sizeClasses = {
    sm: "w-4 h-4", // Small: 16x16px
    md: "w-6 h-6", // Medium: 24x24px (default)
    lg: "w-8 h-8"  // Large: 32x32px
  };

  return (
    <div
      className={cn(
        // Base spinner styles:
        // - animate-spin: CSS animation for continuous rotation
        // - rounded-full: Perfect circle shape
        // - border-2: 2px border width
        // - border-gray-300: Light gray border color
        // - border-t-primary: Top border uses primary theme color for contrast
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
        sizeClasses[size], // Apply size-specific classes
        className // Apply any additional custom classes
      )}
    />
  );
};

// Export component as default export
export default LoadingSpinner;