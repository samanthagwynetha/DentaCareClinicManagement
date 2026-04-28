/**
 * Example Test: Error Middleware
 * 
 * Tests the error handling middleware
 */

import { notFound, errorHandler } from '../middlewares/errorMiddleware.js';

describe('Error Middleware', () => {
  test('notFound should create 404 error', () => {
    const req = { originalUrl: '/invalid-path' };
    const res = {
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    notFound(req, res, next);

    // Should call next with an error
    expect(next).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('Not Found');
  });

  test('errorHandler should hide stack in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new Error('Test error');
    const req = { originalUrl: '/api/test', method: 'GET' };
    const res = {
      statusCode: 500,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    // Should return error without stack in production
    const response = res.json.mock.calls[0][0];
    expect(response.message).toBeDefined();
    expect(response.stack).toBeNull();

    process.env.NODE_ENV = originalEnv;
  });

  test('errorHandler should show stack in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new Error('Test error');
    const req = { originalUrl: '/api/test', method: 'GET' };
    const res = {
      statusCode: 500,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    // Should return error with stack in development
    const response = res.json.mock.calls[0][0];
    expect(response.message).toBeDefined();
    expect(response.stack).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });
});
