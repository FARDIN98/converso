"use client";

// Next.js Link component for client-side navigation
import Link from "next/link";
// Next.js hook to get current pathname for active state
import { usePathname } from "next/navigation";
// React hook for managing component state
import { useState } from "react";

/**
 * Navigation menu items configuration
 * 
 * Defines all the main navigation links in the application.
 * Each item contains a display name and the corresponding route.
 * 
 * @constant {Array<{name: string, href: string}>} navItems - Navigation menu configuration
 */
const navItems = [
  { name: "Home", href: "/" }, // Homepage with popular companions
  { name: "Companions", href: "/companions" }, // Browse all available companions
  { name: "My Journey", href: "/my-journey" }, // User's learning progress and history
  { name: "Analytics", href: "/analytics" }, // Learning analytics and insights
];

/**
 * Navigation Items Component
 * 
 * Renders the main navigation menu with:
 * - Desktop horizontal navigation with hover effects
 * - Mobile hamburger menu with dropdown
 * - Active state highlighting based on current route
 * - Responsive design that adapts to screen size
 * 
 * @component
 * @returns {JSX.Element} Navigation menu items for both desktop and mobile
 */
const NavItems = () => {
  // Get current pathname to highlight active navigation item
  const pathname = usePathname();
  // Track which item is being hovered for visual feedback
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // Control mobile menu open/close state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggle mobile menu visibility
   * Used by the hamburger button to show/hide mobile navigation
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:flex items-center space-x-2">
        {navItems.map((item) => {
          // Check if current item matches the active route
          const isActive = pathname === item.href;
          // Check if current item is being hovered
          const isHovered = hoveredItem === item.name;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${
              isActive ? "nav-item-active" : "nav-item-inactive"
            } ${isHovered ? "nav-item-hovered" : ""}`}
            // Set hover state for visual feedback
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item.name}
          </Link>
        );
      })}
      </div>

      {/* Mobile Navigation - Visible only on mobile devices */}
      <div className="md:hidden">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="hamburger-btn"
          aria-label="Toggle navigation menu" // Accessibility label
          aria-expanded={isMobileMenuOpen} // Accessibility state
        >
          {/* Animated hamburger lines that transform into X when open */}
          <div className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-1-open' : ''}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-2-open' : ''}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-3-open' : ''}`}></div>
        </button>

        {/* Mobile Menu Dropdown - Conditionally rendered */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => {
              // Check if current item matches the active route
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`mobile-nav-item ${
                    isActive ? "mobile-nav-item-active" : "mobile-nav-item-inactive"
                  }`}
                  // Close mobile menu when a link is clicked
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default NavItems;
