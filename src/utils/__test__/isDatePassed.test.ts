import { isDatePassed } from 'utils/isDatePassed';

describe('isDatePassed', () => {
  it('should return true if date is passed 2 days ago', () => {
    const currentDate = new Date();
    const twoDaysAgo = new Date(currentDate);
    twoDaysAgo.setDate(currentDate.getDate() - 3);
    const twoDaysAgoISOString = twoDaysAgo.toISOString();

    expect(isDatePassed(twoDaysAgoISOString, 2)).toBe(true);
  });

  it('should return false if date is within the last 2 days', () => {
    const currentDate = new Date();
    const oneDayAgo = new Date(currentDate);
    oneDayAgo.setDate(currentDate.getDate() - 1);
    const oneDayAgoISOString = oneDayAgo.toISOString();
    expect(isDatePassed(oneDayAgoISOString, 2)).toBe(false);
  });

  it('should return false if date is today', () => {
    const currentDate = new Date();
    const currentDateISOString = currentDate.toISOString();

    expect(isDatePassed(currentDateISOString, 2)).toBe(false);
  });

  it('should return false if input date is empty string', () => {
    expect(isDatePassed('', 2)).toBe(false);
  });
});
