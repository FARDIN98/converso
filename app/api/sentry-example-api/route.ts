/**
 * Sentry Error Testing API Route
 * 
 * This API route is specifically designed to test Sentry's error monitoring
 * and reporting capabilities in the backend. It intentionally throws an error
 * to verify that error tracking is working correctly.
 * 
 * Features:
 * - Custom error class for testing purposes
 * - Forced dynamic rendering to ensure fresh error generation
 * - Integration with Sentry error monitoring
 * 
 * @file API route for testing Sentry error monitoring functionality
 * @requires next/server - Next.js server utilities for API responses
 */

// Next.js server response utilities
import { NextResponse } from "next/server";

// Force dynamic rendering to ensure this route is not statically generated
export const dynamic = "force-dynamic";

/**
 * Custom Error Class for Sentry Testing
 * 
 * A specialized error class that extends the base Error class to provide
 * a specific error type for testing Sentry's error capture functionality.
 * 
 * @class SentryExampleAPIError
 * @extends {Error}
 */
class SentryExampleAPIError extends Error {
  /**
   * Creates an instance of SentryExampleAPIError
   * 
   * @param {string | undefined} message - The error message to display
   */
  constructor(message: string | undefined) {
    // Call the parent Error constructor with the message
    super(message);
    // Set a custom name for this error type for better identification in Sentry
    this.name = "SentryExampleAPIError";
  }
}

/**
 * GET API Route Handler
 * 
 * This handler intentionally throws an error to test Sentry's error monitoring.
 * It's designed to verify that backend errors are properly captured and reported.
 * 
 * @returns {never} This function always throws an error and never returns normally
 * 
 * @throws {SentryExampleAPIError} Always throws this custom error for testing
 * 
 * @example
 * // To test this endpoint:
 * // GET /api/sentry-example-api
 * // This will trigger an error that should appear in Sentry dashboard
 */
export function GET() {
  // Intentionally throw an error to test Sentry error capture
  throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
  
  // This line will never be reached due to the error above
  // It's kept here to show what a normal response would look like
  return NextResponse.json({ data: "Testing Sentry Error..." });
}
