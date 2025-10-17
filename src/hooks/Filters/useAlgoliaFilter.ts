/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as Sentry from '@sentry/react-native';
import { searchClient } from 'App';
import { positionFilterRangeDisplay } from 'components/Filter/Facets';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import useGetFacets from 'hooks/useGetFacets';
import {
  FacetFiltersRequest,
  FacetFiltersRequests,
  FacetFiltersResponse,
  TransformedInterface
} from 'interfaces/AlgoliaInterface';
import { useCallback, useContext, useEffect, useState } from 'react';
import config from 'react-native-config';

export const useAlgoliaFilters = () => {
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);

  const [data, setData] = useState<Array<any>>([]);
  const [facetData, setFacetData] = useState<Array<TransformedInterface>>([]);
  const [tempFacetData] = useState<Array<any>>([]);
  const [filterDatas, setFilterDatas] = useState<Array<any>>([]);
  const [tempFilterDatas, setTempFilterDatas] = useState<Array<any>>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(false);
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [isCollectionIds, setIsCollectionIds] = useState<boolean>(false);
  const [isTags, setIsTag] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [isShowSortBy, setIsShowSortBy] = useState<boolean>(false);

  const [facetActive, setFacetActive] = useState<string>('');
  const [facetFilter, setFacetFilter] = useState<string>('');

  const [filters, setFilter] = useState<string>('');
  const [filtersCount, setFilterCount] = useState<number>(0);
  const [sortByIndexName, setSortByIndexName] = useState<{ label: string; value: string }>({
    label: 'SORT',
    value: config.ALGOLIA_INDEX_NAME
  });
  const [query, setQuery] = useState<string>('');

  const { data: facetsList, isFetching: isFacetsListLoading } = useGetFacets({
    options: { enabled: isShowFilter }
  });

  const searchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const requests = [
        {
          indexName: sortByIndexName.value,
          query: query,
          filters: filters,
          facets: facetsList?.data.map((item) => item.key)
        }
      ];
      const response: any = await searchClient.search({ requests });
      if (response.results) {
        setData(response.results[0].hits);
      }
    } catch (error: any) {
      setIsShowToast(true);
      setToastMessage(error.message);
      setType('error');
      Sentry.withScope((scope) => {
        scope.setTag('Algolia search product', error.message);
        Sentry.captureException('Algolia search product -> ' + error);
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, sortByIndexName]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const filterFacetFiltersByFacets = (generatedData: Array<Array<string>>, facets: string) => {
      return generatedData.filter((item) => !item.some((text) => text.includes(facets)));
    };

    const transformFacetsResponse = (facetsResponse: {
      [key: string]: { [key: string]: number };
    }): TransformedInterface | undefined => {
      for (const key in facetsResponse) {
        const items = facetsResponse[key];

        if (key === 'is_eligible_for_promo_code' && !('true' in items)) {
          continue;
        }

        const valuesFacet = Object.keys(items)
          .filter((value) => !(key === 'is_eligible_for_promo_code' && value === 'false'))
          .map((values, index) => ({
            positions:
              key === 'selling_group' ? positionFilterRangeDisplay[values] || index + 1 : index + 1,
            label: key === 'is_eligible_for_promo_code' ? 'Show Product Discount' : values,
            value:
              key === 'selling_group'
                ? `${values.includes('>') || values.includes('<') ? 'selling_price' : 'selling_price:'} ${values.replace(/S\$\s*/g, '').replace(/\bTo\b/g, 'TO')}`
                : /\s/g.test(values)
                  ? `${key}: "${values}"`
                  : `${key}: ${values}`
          }));

        const currFacet = facetsList?.data.find((item) => item.key === key);

        return {
          id: key === 'selling_group' ? 'selling_price' : key,
          position: currFacet?.position || 0,
          label: currFacet?.label || '',
          values: valuesFacet
        };
      }

      return undefined;
    };

    const fetchFacetFilters = async () => {
      let arrRequest: FacetFiltersRequests['requests'] = [];

      const generateArrayOfString: Array<Array<string>> = filterDatas
        ? Object.values(
            filterDatas.reduce((acc, item) => {
              const facetKey = item.facet === 'selling_price' ? 'selling_group' : item.facet;
              const key = `${facetKey}`;
              const value = `${facetKey}:${facetKey === 'is_eligible_for_promo_code' ? true : item.label}`;

              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(value);

              return acc;
            }, {})
          )
        : [];

      if (isCategory) {
        const match = facetFilter.split(' ');
        if (match) {
          generateArrayOfString.push([`${match[0]} ${match[1]}`]);
        }
      }

      if (isCollectionIds) {
        const match = facetFilter.split(' ');
        if (match) {
          generateArrayOfString.push([`${match[0]} ${match[1]}`]);
        }
      }

      if (isTags) {
        const match = facetFilter.split(' AND ');
        if (match) {
          generateArrayOfString.push([`${match[0]}`]);
        }
      }

      const facetObjFromApi: Array<FacetFiltersRequest> =
        facetsList?.data
          .filter((facet) => !(isCategory && facet.key === 'category_name'))
          .map((facet) => ({
            indexName: config.ALGOLIA_INDEX_NAME,
            facets: facet.key,
            facetFilters: !generateArrayOfString
              ? []
              : filterFacetFiltersByFacets(generateArrayOfString, facet.key),
            hitsPerPage: 0,
            page: 0,
            query: query || ''
          })) || [];

      arrRequest = [...facetObjFromApi];

      try {
        if (isShowFilter) {
          await searchClient.clearCache();
          if (!facetActive) setFacetActive(facetData?.[0]?.id || '');
        } else {
          setFacetActive('');
        }

        const response: FacetFiltersResponse = await searchClient.search({
          requests: arrRequest
        });

        const isAllFacetsEmpty = (checkData: FacetFiltersResponse) => {
          return checkData.results.every((result: any) => {
            if (!result.facets) return true;

            const facetKeys = Object.keys(result.facets);

            if (facetKeys.length === 0) return true;

            // Check if there's is_eligible_for_promo_code with false
            const hasEligibleFalse = facetKeys.some(
              (key) => key === 'is_eligible_for_promo_code' && 'false' in result.facets[key]
            );

            if (hasEligibleFalse) {
              // Check if all other facets are empty
              return facetKeys
                .filter((k) => k !== 'is_eligible_for_promo_code')
                .every((k) => Object.keys(result.facets[k]).length === 0);
            }

            // If no eligible false found, check if all facets are empty
            return facetKeys.every((key) => Object.keys(result.facets[key]).length === 0);
          });
        };

        if (isAllFacetsEmpty(response) && filterDatas.length > 0) {
          setIsLoadingFilter(true);
          setTempFilterDatas([]);
          setFilterDatas([]);
          setFilterCount(0);
          if (isCategory || isCollectionIds) {
            const match = facetFilter.split(' ');
            if (match) {
              setFilter(`${match[0]} ${match[1]}`);
            }
          } else if (isTags) {
            const afterTags = facetFilter.split('tags:')[1].trim();
            const tagValue = afterTags.split(' AND ')[0].trim();
            if (tagValue) {
              setFilter(`tags: "${tagValue}"`);
            }
          } else {
            setFilter('');
          }
          setFacetActive(facetData?.[0]?.id || '');
        } else {
          setIsLoadingFilter(false);
        }

        const transformedResults = response.results.map((result) => {
          // Ensure result has a facets property before transforming
          const facets = (result as { facets: { [key: string]: { [key: string]: number } } })
            .facets;
          return transformFacetsResponse(facets);
        });

        setFacetData(transformedResults.filter((item) => item !== undefined));
      } catch (error: any) {
        setIsShowToast(true);
        setToastMessage(error.message);
        setType('error');
        Sentry.withScope((scope) => {
          scope.setTag('Algolia search Fecet Filter', error.message);
          Sentry.captureException('Algolia search Fecet Filter -> ' + error);
        });
      }
    };

    fetchFacetFilters();
  }, [filterDatas, query, isCategory, isTags, isCollectionIds, isShowFilter, facetsList]);

  useEffect(() => {
    if (filters !== '' || query !== '') {
      searchProducts();
    }
  }, [filters, query, sortByIndexName, searchProducts]);

  useEffect(() => {
    if (isFacetsListLoading) {
      setIsLoadingFilter(true);
    } else {
      setIsLoadingFilter(false);
    }
  }, [isFacetsListLoading]);

  return {
    data,
    filterDatas,
    facetData,
    isLoading,
    isShowSortBy,
    isShowFilter,
    filters,
    filtersCount,
    sortByIndexName,
    facetActive,
    setIsCategory,
    setIsCollectionIds,
    setIsTag,
    setData,
    setFilterDatas,
    setFacetData,
    setIsLoading,
    setIsShowSortBy,
    setIsShowFilter,
    setFilter,
    setFilterCount,
    setSortByIndexName,
    query,
    setQuery,
    setFacetActive,
    tempFacetData,
    setTempFilterDatas,
    tempFilterDatas,
    setFacetFilter,
    isLoadingFilter
  };
};
