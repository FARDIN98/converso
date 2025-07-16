/**
 * Global Error Handler Component
 * 
 * This component serves as the global error boundary for the entire Next.js application.
 * It catches and handles unhandled errors that occur anywhere in the app, providing
 * a fallback UI and error reporting functionality.
 * 
 * Features:
 * - Automatic error reporting to Sentry for monitoring and debugging
 * - Fallback UI display when critical errors occur
 * - Integration with Next.js App Router error handling
 * 
 * @file Global error boundary component for application-wide error handling
 * @requires @sentry/nextjs - Error monitoring and reporting service
 * @requires next/error - Next.js default error page component
 * @requires react - React hooks for side effects
 */

"use client";

// Sentry SDK for error monitoring and reporting
import * as Sentry from "@sentry/nextjs";
// Next.js built-in error page component
import NextError from "next/error";
// React hook for handling side effects
import { useEffect } from "react";

/**
 * Global Error Component
 * 
 * This component is automatically invoked by Next.js when an unhandled error
 * occurs anywhere in the application. It provides error reporting and a fallback UI.
 * 
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error object that was thrown
 * @param {string} [props.error.digest] - Optional error digest for tracking
 * 
 * @returns {JSX.Element} A minimal HTML structure with error display
 * 
 * @example
 * // This component is automatically used by Next.js - no manual implementation needed
 * // When an error occurs, Next.js will render this component
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  /**
   * Effect to report errors to Sentry
   * Automatically captures and sends error details to Sentry for monitoring
   */
  useEffect(() => {
    // Send error details to Sentry for tracking and debugging
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* 
          NextError is the default Next.js error page component
          Its type definition requires a statusCode prop, but since the App Router
          doesn't expose status codes for errors, we pass 0 to render a generic error message
        */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}