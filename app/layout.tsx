// Next.js type imports for metadata configuration
import type { Metadata } from "next";
// Google Fonts import for custom typography
import { Bricolage_Grotesque } from "next/font/google";
// Clerk authentication provider for user management
import { ClerkProvider } from "@clerk/nextjs";
// Global CSS styles for the entire application
import "./globals.css";
// Navigation component that appears on all pages
import Navbar from "@/components/Navbar";
// Toast notification system for user feedback
import { Toaster } from "react-hot-toast";

/**
 * Font configuration for Bricolage Grotesque
 * This creates a CSS variable that can be used throughout the app
 * @constant {NextFont} bricolage - Configured Google Font instance
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage", // CSS custom property name
  subsets: ["latin"], // Character subset to load (optimizes bundle size)
});

/**
 * Application metadata for SEO and browser display
 * This appears in browser tabs, search results, and social media shares
 * @constant {Metadata} metadata - Next.js metadata configuration
 */
export const metadata: Metadata = {
  title: "Converso", // Browser tab title and default page title
  description: "Real-time AI Teaching Platform", // Meta description for SEO
};

/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for the entire Next.js application.
 * It provides:
 * - HTML structure and language setting
 * - Font configuration and anti-aliasing
 * - Authentication context via Clerk
 * - Global navigation
 * - Toast notification system
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render
 * @returns {JSX.Element} The root HTML structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set document language for accessibility and SEO
    <html lang="en">
      <body className={`${bricolage.variable} antialiased`}>
        {/* Authentication provider with custom brand color */}
        <ClerkProvider appearance={{ variables: { colorPrimary: '#fe5933' } }}>
          {/* Global navigation component */}
          <Navbar />
          {/* Dynamic page content */}
          {children}
          {/* Toast notifications positioned at top-center */}
          <Toaster position="top-center" />
        </ClerkProvider>
      </body>
    </html>
  );
}
