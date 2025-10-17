import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from 'styles/colors';

interface BottomFilterTriggerComponentInterface {
  sortLabel: string;
  filterCount: string | number;
  onPress: (type: 'filter' | 'sorting' | string) => void;
}

export const BottomFilterTriggerComponent = ({
  filterCount,
  onPress,
  sortLabel
}: BottomFilterTriggerComponentInterface) => {
  return (
    <View
      style={{
        backgroundColor: colors.secondary,
        width: '100%',
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <TouchableOpacity
        onPress={() => onPress('sorting')}
        style={{
          width: '48%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <Icon name="sortIcon" size="16px" />
        <Text
          label={sortLabel}
          variant="small"
          fontWeight="semi-bold"
          color={colors.light.whiteSolid}
        />
      </TouchableOpacity>
      <View style={{ height: 13, borderWidth: 1, borderColor: colors.red.newPink }} />
      <TouchableOpacity
        onPress={() => onPress('filter')}
        style={{
          width: '48%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <Icon name="filterIcon" size="16px" />
        <Text
          label="FILTER"
          variant="small"
          fontWeight="semi-bold"
          color={colors.light.whiteSolid}
        />
        {filterCount !== 0 && (
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 13,
              backgroundColor: colors.red.newPink,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              label={filterCount.toString()}
              variant="small"
              fontWeight="semi-bold"
              color={colors.light.whiteSolid}
              textAlign="center"
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
