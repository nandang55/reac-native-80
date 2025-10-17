import { currencyFormatter } from '../currencyFormatter';

describe('currencyFormatter', () => {
  it('should format positive SGD amount correctly', () => {
    expect(currencyFormatter(2883.88)).toBe('S$2,883.88');
  });

  it('should format negative SGD amount correctly', () => {
    expect(currencyFormatter(-5000.5)).toBe('-S$5,000.5');
  });

  it('should format zero SGD amount correctly', () => {
    expect(currencyFormatter(0)).toBe('S$0');
  });

  it('should format large SGD amount correctly', () => {
    expect(currencyFormatter(987654321.12)).toBe('S$987,654,321.12');
  });
  it('should format positive IDR amount correctly', () => {
    expect(currencyFormatter(1234567, false)).toBe('Rp1.234.567');
  });

  it('should format negative IDR amount correctly', () => {
    expect(currencyFormatter(-9876543, false)).toBe('-Rp9.876.543');
  });

  it('should format zero IDR amount correctly', () => {
    expect(currencyFormatter(0, false)).toBe('Rp0');
  });

  it('should format large IDR amount correctly', () => {
    expect(currencyFormatter(123456789012345, false)).toBe('Rp123.456.789.012.345');
  });
});
