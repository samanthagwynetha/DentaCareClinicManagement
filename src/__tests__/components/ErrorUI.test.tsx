/**
 * Example Test: ErrorUI Components
 * 
 * Tests the reusable error UI components
 */

import { render, screen } from '@testing-library/react'
import { ErrorDisplay, LoadingSkeleton } from '@/components/ErrorUI'

describe('ErrorDisplay', () => {
  test('displays error title and message', () => {
    render(
      <ErrorDisplay
        title="Test Error"
        message="This is a test error message"
      />
    )

    expect(screen.getByText('Test Error')).toBeTruthy()
    expect(screen.getByText('This is a test error message')).toBeTruthy()
  })

  test('shows retry button when onRetry callback provided', () => {
    const mockRetry = jest.fn()
    render(
      <ErrorDisplay
        title="Error"
        message="Failed"
        onRetry={mockRetry}
      />
    )

    const retryButton = screen.getByRole('button', { name: /Try Again/i })
    expect(retryButton).toBeTruthy()

    // Click retry button
    retryButton.click()
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  test('does not show retry button when onRetry not provided', () => {
    render(
      <ErrorDisplay
        title="Error"
        message="Failed"
      />
    )

    expect(screen.queryByRole('button', { name: /Try Again/i })).toBeNull()
  })

  test('shows error details in development mode', () => {
    const testError = new Error('Test error message')
    
    render(
      <ErrorDisplay
        title="Error"
        message="Failed"
        showDetails={true}
        error={testError}
      />
    )

    // Details should be visible
    expect(screen.getByText(/Error Details/)).toBeTruthy()
  })
})

describe('LoadingSkeleton', () => {
  test('renders loading skeleton', () => {
    const { container } = render(<LoadingSkeleton />)
    
    // Should have skeleton elements with animation
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  test('renders correct number of skeleton items', () => {
    const { container } = render(<LoadingSkeleton />)
    
    const items = container.querySelectorAll('div[class*="h-12"]')
    expect(items.length).toBeGreaterThan(0)
  })
})
