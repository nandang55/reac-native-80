import * as dateFns from 'date-fns';
import { enUS, id } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

export type DateFormatType = 'dd MMM yyyy' | 'dd MMM yyyy, HH.mm' | 'MMM dd, yyyy, HH.mm';

type DateFormatOption = Omit<Parameters<typeof dateFns.format>[2], 'locale'> & {
  locale?: 'id' | 'en';
};

export const formatDate = (
  dateTime: string,
  dateFormat?: DateFormatType,
  { locale = 'id', ...option }: DateFormatOption = {}
) => {
  if (!dateTime) {
    return '';
  }

  const date = dateFns.parseISO(dateTime);

  const timeZoneOffsetMatch = dateTime.match(/([-+]\d{2}:\d{2})$/);

  let timeZone = 'Etc/UTC';

  if (timeZoneOffsetMatch && timeZoneOffsetMatch.length > 0) {
    timeZone = timeZoneOffsetMatch[0];
  }

  const zonedDate = toZonedTime(date, timeZone);

  return dateFns.format(zonedDate, dateFormat || 'dd MMMM yyyy', {
    locale: locale === 'en' ? enUS : id,
    ...option
  });
};
