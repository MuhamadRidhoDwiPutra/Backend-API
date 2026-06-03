import { describe, expect, test, vi } from '@jest/globals';
import { ZodError, ZodIssueCode } from 'zod';
import { AppError, errorHandler } from '../../src/middlewares/errorHandler.js';

const createResponse = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json };
};

describe('errorHandler middleware', () => {
  test('returns AppError response with status code', () => {
    const res = createResponse();
    const err = new AppError('Not allowed', 403);
    errorHandler(err, {} as any, res as any, () => undefined);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Not allowed' });
  });

  test('returns ZodError validation response', () => {
    const res = createResponse();
    const zodError = new ZodError([
      {
        code: ZodIssueCode.invalid_type,
        path: ['name'],
        message: 'Name is required',
        expected: 'string',
        received: 'undefined',
      },
    ]);

    errorHandler(zodError, {} as any, res as any, () => undefined);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation Error',
      errors: [{ field: 'name', message: 'Name is required' }],
    });
  });

  test('returns generic error in development', () => {
    const res = createResponse();
    const err = new Error('Unexpected');
    errorHandler(err, {} as any, res as any, () => undefined);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unexpected',
    });
  });
});
