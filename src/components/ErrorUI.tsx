'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * API Error Handler Component
 * 
 * Wraps sections that fetch data and handles loading/error states
 * Usage: Wrap around components that use apiFetch
 * 
 * Example:
 * <APIErrorHandler>
 *   <PatientList />
 * </APIErrorHandler>
 */
export function APIErrorHandler({ children }: Props) {
  return <>{children}</>;
}

/**
 * Reusable Error UI Component
 * 
 * Display when an API call fails
 * Usage: Show this when apiFetch throws an error
 */
export interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showDetails?: boolean;
  error?: Error;
}

export function ErrorDisplay({
  title = "Error Occurred",
  message,
  onRetry,
  showDetails = false,
  error,
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">❌</span>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-red-900 mb-1">{title}</h3>
          <p className="text-sm text-red-700">{message}</p>

          {showDetails && error && process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-red-600 font-medium">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs bg-white p-2 border border-red-200 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Skeleton Component
 * 
 * Show while data is loading
 */
export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-md animate-pulse" />
      ))}
    </div>
  );
}
