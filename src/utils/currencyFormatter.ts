import Config from 'react-native-config';

const region = Config.APP_REGION;

export const currencyFormatter = (amount: number, isSgRegion = region === 'sg'): string => {
  const countryCode = isSgRegion ? 'en-SG' : 'id-ID';
  const currency = isSgRegion ? 'SGD' : 'IDR';

  const formatter = new Intl.NumberFormat(countryCode, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: isSgRegion ? 2 : 0
  });

  let formattedAmount = formatter.format(amount);

  if (isSgRegion) {
    formattedAmount = formattedAmount.replace('$', 'S$');
  } else {
    formattedAmount = formattedAmount.replace(/\s+/g, '');
  }

  return formattedAmount;
};
