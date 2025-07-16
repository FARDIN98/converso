/**
 * @fileoverview CTA (Call-to-Action) component for encouraging users to create new companions
 * Features a compelling message, visual elements, and a prominent action button.
 */

// Next.js components for optimized image rendering and client-side navigation
import Image from "next/image";
import Link from "next/link";

/**
 * Call-to-Action component that encourages users to create new learning companions
 * Features an engaging design with badge, heading, description, illustration, and action button
 * 
 * @component
 * @returns {JSX.Element} A section containing CTA elements for companion creation
 * 
 * @features
 * - Eye-catching badge with motivational message
 * - Clear value proposition in heading and description
 * - Visual illustration to enhance appeal
 * - Prominent action button with icon and navigation
 * - Responsive design for various screen sizes
 * 
 * @example
 * <Cta />
 * 
 * @accessibility
 * - Semantic HTML structure with proper heading hierarchy
 * - Alt text for images
 * - Keyboard-accessible navigation link
 */
const Cta = () => {
    return (
        <section className="cta-section">
            {/* Motivational badge */}
            <div className="cta-badge">Start learning your way.</div>
            
            {/* Main heading with value proposition */}
            <h2 className="text-3xl font-bold">
                Build and Personalize Learning Companion
            </h2>
            
            {/* Descriptive text explaining the process */}
            <p>Pick a name, subject, voice, & personality — and start learning through voice conversations that feel natural and fun.</p>
            
            {/* Visual illustration */}
            <Image src="images/cta.svg" alt="cta" width={362} height={232} />
            
            {/* Primary action button with icon and navigation */}
            <button className="btn-primary">
                {/* Plus icon for visual emphasis */}
                <Image src="/icons/plus.svg" alt="plus" width={12} height={12}/>
                {/* Navigation link to companion creation page */}
                <Link href="/companions/new">
                    <p>Build a New Companion</p>
                </Link>
            </button>
        </section>
    )
}
export default Cta;
