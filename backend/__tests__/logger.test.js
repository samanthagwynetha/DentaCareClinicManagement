/**
 * Example Test: Logger Utility
 * 
 * Tests the structured logging system
 */

import logger from '../utils/logger.js';

describe('Logger Utility', () => {
  test('logger module should be defined', () => {
    expect(logger).toBeDefined();
  });

  test('logger should have required methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  test('logger.info should accept message and metadata', () => {
    // This tests that logger can be called without errors
    expect(() => {
      logger.info('Test message', { module: 'test', id: '123' });
    }).not.toThrow();
  });

  test('logger.error should accept error objects', () => {
    expect(() => {
      logger.error('Test error', {
        error: 'Something went wrong',
        statusCode: 500
      });
    }).not.toThrow();
  });
});
