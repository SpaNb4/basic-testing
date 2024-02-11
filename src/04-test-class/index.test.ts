import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 50;
    const withdrawValue = 100;
    const bankAccount = getBankAccount(initialBalance);

    expect(() => bankAccount.withdraw(withdrawValue)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 50;
    const transferValue = 100;
    const bankAccount = getBankAccount(initialBalance);
    const otherAccount = getBankAccount(0);

    expect(() => bankAccount.transfer(transferValue, otherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 50;
    const valueToTransfer = 100;
    const bankAccount = getBankAccount(initialBalance);

    expect(() => bankAccount.transfer(valueToTransfer, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 0;
    const depositValue = 100;
    const bankAccount = getBankAccount(initialBalance);

    bankAccount.deposit(depositValue);

    expect(bankAccount.getBalance()).toBe(depositValue);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const withdrawValue = 50;
    const bankAccount = getBankAccount(initialBalance);

    bankAccount.withdraw(withdrawValue);

    expect(bankAccount.getBalance()).toBe(initialBalance - withdrawValue);
  });

  test('should transfer money', () => {
    const initialBalance = 1000;
    const transferValue = 500;
    const bankAccount = getBankAccount(initialBalance);

    const otherAccountInitialBalance = 100;
    const otherAccount = getBankAccount(otherAccountInitialBalance);

    bankAccount.transfer(transferValue, otherAccount);

    expect(bankAccount.getBalance()).toBe(initialBalance - transferValue);
    expect(otherAccount.getBalance()).toBe(
      otherAccountInitialBalance + transferValue,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    jest.mocked(random).mockReturnValue(50);
    const balance = await bankAccount.fetchBalance();

    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 10;
    const bankAccount = getBankAccount(initialBalance);

    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(50);
    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 10;
    const bankAccount = getBankAccount(initialBalance);

    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
