import { describe, expect, test } from '@jest/globals';
import { decimalToNumber, generateToken, verifyToken } from '../../src/utils/index.js';

describe('utils', () => {
  test('decimalToNumber converts decimals and strings to number', () => {
    expect(decimalToNumber('12.34')).toBe(12.34);
    expect(decimalToNumber(42)).toBe(42);
    expect(decimalToNumber({ toNumber: () => 99 })).toBe(99);
  });

  test('generateToken and verifyToken work together', () => {
    const payload = { userId: 'user-1', email: 'test@example.com', role: 'CUSTOMER' };
    const token = generateToken(payload as any);
    expect(typeof token).toBe('string');

    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe('user-1');
    expect(verified?.email).toBe('test@example.com');
    expect(verified?.role).toBe('CUSTOMER');
  });
});
