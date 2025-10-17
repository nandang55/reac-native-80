import { SearchResponses } from 'algoliasearch';

export type FacetFiltersResponse = SearchResponses;

export interface FacetFiltersRequests {
  requests: Array<FacetFiltersRequest>;
}

export interface FacetFiltersRequest {
  indexName: string;
  facets: string;
  facetFilters: Array<Array<string>>;
  hitsPerPage: number;
  page: number;
  query: string;
}

export interface FilterDatasInterface {
  positions: number;
  label: string;
  value: string;
  facet: string;
}

export interface TransformedInterface {
  id: string;
  position: number;
  label: string;
  values: Array<{
    positions: number;
    label: string;
    value: string;
  }>;
}

export interface FacetDataInterface {
  key: string;
  label: string;
  position: number;
}
