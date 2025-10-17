import { formatDate } from 'utils/formatDate';

describe('formatDate function with different time zones', () => {
  it('should format date correctly in default format and locale with different time zone', () => {
    const dateTime = '2024-06-08T08:19:16+08:00';
    const formattedDate = formatDate(dateTime);
    expect(formattedDate).toBe('08 Juni 2024');
  });

  it('should format date correctly in custom format and locale (English) with different time zone', () => {
    const dateTime = '2024-06-08T08:19:16+08:00';
    const formattedDate = formatDate(dateTime, 'dd MMM yyyy, HH.mm', { locale: 'en' });
    expect(formattedDate).toBe('08 Jun 2024, 08.19');
  });

  it('should format date correctly with different time zone offset', () => {
    const dateTime = '2024-06-08T08:19:16+07:00';
    const formattedDate = formatDate(dateTime, 'dd MMM yyyy, HH.mm', { locale: 'en' });
    expect(formattedDate).toBe('08 Jun 2024, 08.19');
  });
});
