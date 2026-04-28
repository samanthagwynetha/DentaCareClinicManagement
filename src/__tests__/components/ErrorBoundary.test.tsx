/**
 * Example Test: ErrorBoundary Component
 * 
 * Tests the error boundary component
 * Run: npm test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Component that throws an error (for testing)
function ThrowError(): never {
  throw new Error('Test error')
}

// Component that renders normally
function GoodComponent() {
  return <div>No errors here</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  const setNodeEnv = (value: string) => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value,
      writable: true,
      configurable: true,
    })
  }

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('No errors here')).toBeTruthy()
  })

  test('displays error message when child throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Something went wrong/i)).toBeTruthy()
  })

  test('shows recovery buttons', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: /Try Again/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Go Home/i })).toBeTruthy()
  })

  test('displays error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    setNodeEnv('development')

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    // In development, error details should be visible
    expect(screen.getByText(/Test error/)).toBeTruthy()

    setNodeEnv(originalEnv ?? 'test')
  })
})
