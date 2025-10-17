/* eslint-disable eslint-comments/disable-enable-pair */

import config from 'react-native-config';

export type Range = {
  label: string;
  value: string;
};

export type SortByType = {
  label: string;
  value: string;
};

export const positionFilterRangeDisplay: Record<string, number> = {
  '< S$ 10': 1,
  'S$ 10 To S$ 50': 2,
  'S$ 51 To S$ 100': 3,
  'S$ 101 To S$ 150': 4,
  'S$ 151 To S$ 200': 5,
  '> S$ 200': 6
};

export const SortByFacetData: Array<SortByType> = [
  {
    label: 'Latest',
    value: config.ALGOLIA_INDEX_NAME_LATEST
  },
  {
    label: 'Price: Low to High',
    value: config.ALGOLIA_INDEX_NAME_ASC
  },
  {
    label: 'Price: High to Low',
    value: config.ALGOLIA_INDEX_NAME_DSC
  }
];

export const range: Array<Range> = [
  { label: '< S$ 10', value: 'selling_price < 10' },
  { label: 'S$ 10 To S$ 50', value: 'selling_price:  10 TO 50' },
  { label: 'S$ 51 To S$ 100', value: 'selling_price:  51 TO 100' },
  { label: 'S$ 101 To S$ 150', value: 'selling_price:  101 TO 150' },
  { label: 'S$ 151 To S$ 200', value: 'selling_price:  151 TO 200' },
  { label: '> S$ 200', value: 'selling_price > 200' }
];
