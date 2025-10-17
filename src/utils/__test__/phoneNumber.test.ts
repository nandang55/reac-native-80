import { phoneNumberFormat, removeFirstZeroInPhoneNumber } from '../phoneNumber';

test('test phone number format', () => {
  expect(phoneNumberFormat('08131314151')).toEqual('+628131314151');
});

test('test remove first zero in phone number', () => {
  expect(removeFirstZeroInPhoneNumber('08131314151')).toEqual('8131314151');
});

test('test remove first zero in phone number (without zero)', () => {
  expect(removeFirstZeroInPhoneNumber('8131314151')).toEqual('8131314151');
});
