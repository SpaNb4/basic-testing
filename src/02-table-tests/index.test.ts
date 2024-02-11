import { simpleCalculator, Action } from './index';
const testCases = [
  { a: 5, b: 3, action: Action.Add, expected: 8 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 5, b: 3, action: Action.Multiply, expected: 15 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 3, action: 'InvalidAction', expected: null },
  { a: 'InvalidNumber', b: 3, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  testCases.forEach(({ a, b, action, expected }) => {
    test(`should return ${expected} when performing ${action} on ${a} and ${b}`, () => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    });
  });
});
