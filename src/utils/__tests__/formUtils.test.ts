import { describe, it, expect } from 'vitest';
import { checkPasswordStrength, getStrengthText, validateImage } from '../formUtils';

describe('checkPasswordStrength', () => {
  it('returns score 0 for empty password', () => {
    const { score, criteria } = checkPasswordStrength('');
    expect(score).toBe(0);
    expect(criteria.hasNumber).toBe(false);
    expect(criteria.hasUppercase).toBe(false);
    expect(criteria.hasLowercase).toBe(false);
    expect(criteria.hasSpecial).toBe(false);
  });

  it('returns score 4 for strong password', () => {
    const { score } = checkPasswordStrength('Aa1!abcd');
    expect(score).toBe(4);
  });

  it('detects number', () => {
    const { criteria } = checkPasswordStrength('1');
    expect(criteria.hasNumber).toBe(true);
    expect(criteria.hasUppercase).toBe(false);
    expect(criteria.hasLowercase).toBe(false);
    expect(criteria.hasSpecial).toBe(false);
  });

  it('detects uppercase', () => {
    const { criteria } = checkPasswordStrength('A');
    expect(criteria.hasUppercase).toBe(true);
  });

  it('detects lowercase', () => {
    const { criteria } = checkPasswordStrength('a');
    expect(criteria.hasLowercase).toBe(true);
  });

  it('detects special character', () => {
    const { criteria } = checkPasswordStrength('!');
    expect(criteria.hasSpecial).toBe(true);
  });
});

describe('getStrengthText', () => {
  it('returns correct text for each score', () => {
    expect(getStrengthText(0)).toBe('Очень слабый');
    expect(getStrengthText(1)).toBe('Слабый');
    expect(getStrengthText(2)).toBe('Средний');
    expect(getStrengthText(3)).toBe('Хороший');
    expect(getStrengthText(4)).toBe('Отличный');
  });
});

describe('validateImage', () => {
  it('rejects non-image file', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    await expect(validateImage(file)).rejects.toThrow('Допустимые форматы: JPEG, PNG');
  });

  it('rejects file > 5MB', async () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    await expect(validateImage(largeFile)).rejects.toThrow('не должен превышать 5MB');
  });

  it('resolves with base64 for valid PNG', async () => {
    const pngFile = new File(['dummy'], 'test.png', { type: 'image/png' });
    const result = await validateImage(pngFile);
    expect(result).toMatch(/^data:image\/png;base64,/);
  });
});