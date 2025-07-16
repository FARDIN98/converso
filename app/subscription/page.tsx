/**
 * @fileoverview Subscription and pricing page component
 * 
 * This page displays subscription plans and pricing options using Clerk's
 * pre-built PricingTable component, enabling users to upgrade their accounts
 * and access premium features.
 * 
 * Features:
 * - Pre-built pricing table from Clerk
 * - Multiple subscription tiers and plans
 * - Integrated payment processing
 * - Automatic subscription management
 * - Real-time plan comparison
 * - Responsive design for all devices
 * - Secure payment handling
 * 
 * Business Logic:
 * - Displays available subscription plans
 * - Handles plan upgrades and downgrades
 * - Manages billing cycles and pricing
 * - Provides clear feature comparisons
 * - Integrates with Clerk's subscription system
 * 
 * User Experience:
 * - Clear pricing presentation
 * - Easy plan selection and upgrade process
 * - Transparent feature listings
 * - Secure checkout experience
 * - Immediate access after subscription
 * 
 * Security:
 * - PCI DSS compliant payment processing
 * - Secure subscription management
 * - Protected billing information
 * - Fraud prevention measures
 * 
 * @requires @clerk/nextjs - Clerk subscription and pricing components
 */

import {PricingTable} from "@clerk/nextjs";

/**
 * Subscription - Subscription and pricing page component
 * 
 * This component renders Clerk's PricingTable component to display
 * subscription plans and handle user upgrades.
 * 
 * @returns {JSX.Element} Rendered subscription page with pricing table
 * 
 * Functionality:
 * - Displays all available subscription plans
 * - Handles plan selection and checkout process
 * - Manages subscription state and billing
 * - Provides clear pricing and feature information
 * 
 * Integration:
 * - Connected to Clerk's subscription system
 * - Automatic user account updates after purchase
 * - Real-time plan status synchronization
 * - Seamless billing and payment processing
 * 
 * Layout:
 * - Simple, clean layout focusing on pricing content
 * - Responsive design for optimal viewing on all devices
 * - Consistent with application design patterns
 */
const Subscription = () => {
    return (
        // Main container for the subscription page
        <main>
            {/* Clerk's pre-built pricing table with full subscription functionality */}
            <PricingTable />
        </main>
    )
}

export default Subscription
