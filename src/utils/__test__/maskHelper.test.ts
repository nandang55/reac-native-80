import { maskEmailAddress, maskPhoneNumber } from 'utils/maskHelper';

describe('maskPhoneNumber function', () => {
  it('correctly masks a phone number', () => {
    const phoneNumber = '123-456-7890';
    const masked = maskPhoneNumber(phoneNumber);
    expect(masked).toMatch(/\*\*-\*\*\*\*-7890/);
  });
});

describe('maskEmailAddress function', () => {
  it('correctly masks an email address', () => {
    const email = 'test@example.com';
    const masked = maskEmailAddress(email);
    expect(masked).toMatch(/\*\*st@example.com/);
  });
});
