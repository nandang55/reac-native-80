import * as dateFns from 'date-fns';
import { enUS, id } from 'date-fns/locale';

export type DateFormatType = 'dd MMM yyyy' | 'dd MMM yyyy, HH.mm';

type DateFormatOption = Omit<Parameters<typeof dateFns.format>[2], 'locale'> & {
  locale?: 'id' | 'en';
};

//TODO: remove, can use formatDate()
export const dateFormatter = (
  date: Date,
  dateFormat?: DateFormatType,
  { locale = 'id', ...option }: DateFormatOption = {}
) => {
  return dateFns.format(date, dateFormat || 'dd MMMM yyyy', {
    locale: locale === 'en' ? enUS : id,
    ...option
  });
};
