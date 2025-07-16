// Next.js Link component for client-side navigation
import Link from "next/link";
// Next.js optimized Image component for performance
import Image from "next/image";
// Clerk authentication components for user management
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// Custom navigation items component
import NavItems from "@/components/NavItems";

/**
 * Navigation Bar Component
 * 
 * The main navigation component that appears on all pages.
 * Features:
 * - Logo with home link
 * - Navigation menu items (Home, Companions, My Journey, Analytics)
 * - Authentication state management (Sign In/User Profile)
 * - Responsive design with mobile menu support
 * 
 * @component
 * @returns {JSX.Element} The navigation bar with logo, menu, and auth controls
 */
const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Logo and Home Link */}
            <Link href="/">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    {/* Optimized logo image */}
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={46}
                        height={44}
                    />
                </div>
            </Link>
            
            {/* Navigation Menu and Authentication */}
            <div className="flex items-center gap-8">
                {/* Main navigation items */}
                <NavItems />
                
                {/* Authentication Controls - Show sign in for unauthenticated users */}
                <SignedOut>
                    <SignInButton>
                        <button className="btn-signin">Sign In</button>
                    </SignInButton>
                </SignedOut>
                
                {/* Authentication Controls - Show user profile for authenticated users */}
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar
