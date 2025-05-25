import { addNumber, subtractNumber } from '../src/math';

describe('Math Utilities', () => {
  test('adds two numbers correctly', () => {
    expect(addNumber(1, 2)).toBe(3);
    expect(addNumber(-1, 5)).toBe(4);
  });
  test('subtracts two numbers correctly', () => {
    expect(subtractNumber(5, 2)).toBe(3);
    expect(subtractNumber(10, -5)).toBe(15);
  });
});