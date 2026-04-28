'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service (optional)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      // logErrorToService(error);
    } else {
      console.error('Next.js Error:', error);
    }
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <span className="text-5xl">⚠️</span>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Something Went Wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            We're having trouble loading this page. Please try refreshing or return to the home page.
          </p>

          {/* Error Details (Development Only) */}
          {isDevelopment && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-md text-left">
              <p className="text-xs font-bold text-red-900 mb-2">Error Details:</p>
              <p className="text-xs font-mono text-red-700 break-words mb-2">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <button
              onClick={() => reset()}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors text-center"
            >
              Go Home
            </Link>
          </div>

          {/* Support Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <a
              href="mailto:support@dentalclinic.com"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Contact Support →
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Error ID: {error.digest || 'unknown'}
        </p>
      </div>
    </div>
  );
}
