import { Text } from 'components/Text';
import React from 'react';
import { Modal, Platform, TouchableOpacity, View } from 'react-native';
import config from 'react-native-config';
import colors from 'styles/colors';

import { SortByFacetData } from './Facets';

interface SortingInterface {
  isVisible: boolean;
  onClosed: () => void;
  sortByIndexName: string;
  setSortByIndexName: (value: { label: string; value: string }) => void;
}

export const SortingComponent = ({
  isVisible,
  onClosed,
  sortByIndexName,
  setSortByIndexName
}: SortingInterface) => {
  return (
    <Modal transparent visible={isVisible} onRequestClose={onClosed}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={onClosed}
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            width: '100%',
            height: Platform.OS === 'ios' ? 260 : 245,
            backgroundColor: colors.light.whiteSolid,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
          }}
        >
          <View
            style={{
              width: '100%',
              height: 65,
              backgroundColor: colors.red.newPink2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              label="Sort Items by"
              color={colors.dark.blackCoral}
              variant="large"
              fontWeight="semi-bold"
            />
          </View>
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 24,
              marginBottom: 16
            }}
          >
            {SortByFacetData.map((item, index) => {
              const isActive = item.value === sortByIndexName;

              return (
                <TouchableOpacity
                  onPress={() => {
                    setSortByIndexName(
                      isActive
                        ? { label: 'SORT', value: config.ALGOLIA_INDEX_NAME }
                        : { label: item.label, value: item.value }
                    );
                    onClosed();
                  }}
                  key={index}
                  style={{
                    backgroundColor: isActive ? colors.red.newPink2 : 'transparent',
                    width: '100%',
                    height: 44,
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    marginBottom: 4
                  }}
                >
                  <Text
                    label={item.label}
                    color={isActive ? colors.secondary : colors.dark.neutral}
                    variant="medium"
                    fontWeight={isActive ? 'semi-bold' : 'regular'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};
