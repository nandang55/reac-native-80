/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */

// TODO: FIX TYPE DATA ANY USE TYPE DATA FROM ALGOLIA
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { Loading } from 'components/Loading';
import { Text } from 'components/Text';
import { FilterDatasInterface, TransformedInterface } from 'interfaces/AlgoliaInterface';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'styles/colors';

const FilterComponent = ({
  isVisible,
  onClosed,
  onApply,
  onClearAll,
  facetData,
  filterDatas,
  setFilterDatas,
  facetActive,
  setFacetActive,
  onFilterFacet,
  isLoading
}: {
  isVisible: boolean;
  facetActive: string;
  onClosed: () => void;
  onClearAll: () => void;
  onApply: (values: string, total: string) => void;
  onFilterFacet: (values: string, total: string) => void;
  facetData: Array<TransformedInterface>;
  filterDatas: Array<any>;
  setFilterDatas: (values: Array<any>) => void;
  setFacetActive: (values: string) => void;
  isLoading: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState(0);

  const handleSelectFilter = (items: { label: string; value: string }) => {
    const index = filterDatas.findIndex((item) => item.value === items.value);
    setKey(key + 1);

    if (index === -1) {
      setFilterDatas([...filterDatas, { ...items, facet: facetActive }]);
    } else {
      setFilterDatas(filterDatas.filter((item) => item.value !== items.value));
    }
  };

  const countActiveFiltersByFacet = (filters: Array<any>) => {
    return filters.reduce((result, filter) => {
      const { facet } = filter;
      result[facet] = (result[facet] || 0) + 1;
      return result;
    }, {});
  };

  const activeFiltersCount = countActiveFiltersByFacet(filterDatas);

  const transformFilters = (filterData: Array<FilterDatasInterface>) => {
    const groupedFacet: Record<string, Array<FilterDatasInterface>> = filterData.reduce(
      (acc, item) => {
        if (!acc[item.facet]) {
          acc[item.facet] = [];
        }
        acc[item.facet].push(item);
        return acc;
      },
      {} as Record<string, Array<FilterDatasInterface>>
    );

    const results: Array<string> = Object.entries(groupedFacet).map(([facet, items]) => {
      const values = items.map((item) => item.value);

      if (facet === 'is_eligible_for_promo_code') {
        return values[0];
      }

      if (values.length === 1) {
        return values[0];
      }

      return `(${values.join(' OR ')})`;
    });

    return results;
  };

  const handleApply = () => {
    const results = transformFilters(filterDatas);

    return results.toString().replace(/,/g, ' AND ');
  };

  useEffect(() => {
    onFilterFacet(handleApply(), filterDatas.length.toString());
  }, [filterDatas]);

  const getValuesFromFacet = () => {
    const result = [...facetData];

    filterDatas.forEach((selectedItem) => {
      const categoryIndex = result.findIndex((category) => category.id === selectedItem.facet);

      if (categoryIndex !== -1) {
        const existingValue = result[categoryIndex].values.some(
          (item: any) => item.value === selectedItem.value
        );

        if (!existingValue) {
          result[categoryIndex].values.push({
            positions: selectedItem.positions,
            label: selectedItem.label,
            value: selectedItem.value
          });
        }
      }
    });

    return (
      result
        .find((values) => values?.id === facetActive)
        ?.values.sort((a, b) => {
          if (
            facetActive === 'shop_for' ||
            facetActive === 'occasion' ||
            facetActive === 'options.material' ||
            facetActive === 'category_name'
          ) {
            return a.label.localeCompare(b.label);
          } else {
            return a.positions - b.positions;
          }
        }) || []
    );
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClosed}>
      <Loading visible={isLoading} size={'large'} />
      <LayoutScreen
        backgroundColor={colors.light.whiteSolid}
        statusBarColor={colors.light.whiteSolid}
        isNoPadding
      >
        <View style={[{ flex: 1 }, Platform.OS === 'ios' && { paddingTop: insets.top }]}>
          <View
            style={{
              overflow: 'hidden',
              paddingBottom: 2
            }}
          >
            <View
              style={{
                backgroundColor: colors.light.whiteSolid,
                width: '100%',
                height: 56,
                shadowColor: colors.dark.blackSolid,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  onClosed();
                }}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: colors.dark.silver,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon name="close" size="16px" color={colors.dark.blackCoral} />
              </TouchableOpacity>
              <Text
                label="Filter"
                color={colors.dark.blackCoral}
                variant="extra-large"
                fontWeight="semi-bold"
              />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ backgroundColor: colors.red.newPink2, width: 160 }}>
              <FlatList
                data={facetData}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setFacetActive(item.id)}
                    style={{
                      width: '100%',
                      height: 46,
                      paddingLeft: 16,
                      paddingRight: 12,
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.dark.solitude,
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ paddingRight: 24 }}>
                      <Text
                        label={item.label}
                        variant="small"
                        fontWeight={item.id === facetActive ? 'semi-bold' : 'regular'}
                        color={item.id === facetActive ? colors.secondary : colors.dark.blackCoral}
                      />
                    </View>

                    {activeFiltersCount[item.id] && (
                      <View
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: 13,
                          backgroundColor: colors.secondary,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text
                          label={activeFiltersCount[item.id]}
                          variant="small"
                          fontWeight="semi-bold"
                          color={colors.light.whiteSolid}
                          textAlign="center"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
            <View key={key}>
              <FlatList
                data={getValuesFromFacet()}
                renderItem={({ item }) => {
                  const isChecked = filterDatas.find((values) => {
                    return values.value === item.value ? true : false;
                  });
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectFilter(item)}
                      style={{
                        width: '100%',
                        height: 46,
                        paddingLeft: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      {item?.label && (
                        <Icon
                          name={isChecked ? 'checkedCircle' : 'checkCircleOutline'}
                          size="16px"
                          color={colors.red.newPink}
                        />
                      )}
                      <Text
                        label={item?.label}
                        variant="small"
                        fontWeight={isChecked ? 'semi-bold' : 'regular'}
                        color={isChecked ? colors.secondary : colors.dark.blackCoral}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.light.whiteSolid,
            width: '90%',
            height: 72,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            marginTop: 16
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setFilterDatas([]);
              onClearAll();
            }}
            style={{
              width: '48%',
              height: 40,
              borderRadius: 98,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.dark.gumbo
            }}
          >
            <Text
              label="Clear All"
              variant="medium"
              fontWeight="semi-bold"
              color={colors.dark.gumbo}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onApply(handleApply(), filterDatas.length.toString());
            }}
            style={{
              width: '48%',
              height: 40,
              borderRadius: 98,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.secondary
            }}
          >
            <Text
              label="Apply"
              variant="medium"
              fontWeight="semi-bold"
              color={colors.light.whiteSolid}
            />
          </TouchableOpacity>
        </View>
      </LayoutScreen>
    </Modal>
  );
};

export default FilterComponent;
