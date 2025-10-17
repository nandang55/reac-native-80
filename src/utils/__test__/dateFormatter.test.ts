import { dateFormatter } from '../dateFormatter';

const date = new Date('2021-10-15T01:30:00.000-05:00');

test('test (dd MMMM yyyy) id', () => {
  expect(dateFormatter(date, 'dd MMM yyyy', { locale: 'id' })).toEqual('15 Okt 2021');
});

test('test (dd MMMM yyyy) en', () => {
  expect(dateFormatter(date, 'dd MMM yyyy', { locale: 'en' })).toEqual('15 Oct 2021');
});

test('test (dd MMMM yyyy) id', () => {
  expect(dateFormatter(date)).toEqual('15 Oktober 2021');
});
