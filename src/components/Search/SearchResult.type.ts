import { UseInfiniteHitsProps } from 'react-instantsearch-core';

export interface SearchResultInterface extends UseInfiniteHitsProps {
  data: Array<{ id: string; name: string }>;
  from?: string;
}
