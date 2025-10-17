import { format } from 'date-fns';

import { timesAgo } from '../timesAgo';

describe('timesAgo function', () => {
  test('Less than 1 hour ago should return time in HH:mm format', () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 30);
    const formattedTime = timesAgo(date.toISOString());
    expect(formattedTime).toMatch(/^\d{2}:\d{2}$/);
  });

  test('Between 1 and 24 hours ago should return X Hours Ago', () => {
    const date = new Date();
    date.setHours(date.getHours() - 5);
    const formattedTime = timesAgo(date.toISOString());
    expect(formattedTime).toEqual('5 hours ago');
  });

  test('More than 24 hours ago should return date in MMM dd format', () => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    const formattedTime = timesAgo(date.toISOString());
    const expectedDate = format(date, 'MMM dd');
    expect(formattedTime).toEqual(expectedDate);
  });
});
