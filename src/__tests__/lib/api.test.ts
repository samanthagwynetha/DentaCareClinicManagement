/**
 * Example Test: API Client
 * 
 * Tests the API error handling and fetching
 */

import { apiFetch, APIError, getErrorMessage } from '@/lib/api'

// Mock the auth handler
jest.mock('@/utils/auth', () => ({
  getToken: jest.fn(() => 'mock-token'),
}))

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('makes successful API call', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      } as Response)
    )

    const result = await apiFetch('/api/test')
    expect(result).toEqual({ data: 'test' })
  })

  test('throws APIError on failed request', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      } as Response)
    )

    await expect(apiFetch('/api/test')).rejects.toThrow(APIError)
  })

  test('APIError.isServerError property works', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      } as Response)
    )

    try {
      await apiFetch('/api/test')
    } catch (error) {
      expect(error).toBeInstanceOf(APIError)
      expect((error as APIError).isServerError).toBe(true)
    }
  })

  test('APIError.isClientError property works', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad request' }),
      } as Response)
    )

    try {
      await apiFetch('/api/test')
    } catch (error) {
      expect(error).toBeInstanceOf(APIError)
      expect((error as APIError).isClientError).toBe(true)
    }
  })

  test('handles network errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new TypeError('Failed to fetch'))
    )

    await expect(apiFetch('/api/test')).rejects.toThrow()
  })
})

describe('getErrorMessage', () => {
  test('returns network error message', () => {
    const error = new APIError(0, 'Network error')
    const message = getErrorMessage(error)
    expect(message).toContain('internet connection')
  })

  test('returns auth error message', () => {
    const error = new APIError(401, 'Unauthorized')
    const message = getErrorMessage(error)
    expect(message).toContain('not authorized')
  })

  test('returns server error message', () => {
    const error = new APIError(500, 'Server error')
    const message = getErrorMessage(error)
    expect(message).toContain('Server error')
  })

  test('handles Error objects', () => {
    const error = new Error('Test error')
    const message = getErrorMessage(error)
    expect(message).toBe('Test error')
  })

  test('handles unknown error types', () => {
    const message = getErrorMessage(null)
    expect(message).toContain('unexpected error')
  })
})
