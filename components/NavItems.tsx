"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Companions", href: "/companions" },
  { name: "My Journey", href: "/my-journey" },
  { name: "Analytics", href: "/analytics" },
];

const NavItems = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isHovered = hoveredItem === item.name;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${
              isActive ? "nav-item-active" : "nav-item-inactive"
            } ${isHovered ? "nav-item-hovered" : ""}`}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item.name}
          </Link>
        );
      })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="hamburger-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-1-open' : ''}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-2-open' : ''}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? 'hamburger-line-3-open' : ''}`}></div>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`mobile-nav-item ${
                    isActive ? "mobile-nav-item-active" : "mobile-nav-item-inactive"
                  }`}
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
