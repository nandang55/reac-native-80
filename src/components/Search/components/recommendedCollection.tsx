import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'components/Text';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring
} from 'react-native-reanimated';
import colors from 'styles/colors';

type CollectionNavigatorProps = StackNavigationProp<RootStackParamList>;

export const RecommendedCollection = ({
  data,
  from
}: {
  data: Array<{ id: string; name: string }>;
  from?: string;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <FlatList
      numColumns={2}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <RenderItem item={item} index={index} from={from} />}
      ListHeaderComponent={
        data.length > 0 ? (
          <Animated.View style={[animatedStyle]}>
            <Text
              label="Recommended Collections"
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
          </Animated.View>
        ) : null
      }
      ListHeaderComponentStyle={{
        paddingVertical: 16,
        paddingHorizontal: 4
      }}
    />
  );
};

const RenderItem = ({
  item,
  index,
  from
}: {
  item: { id: string; name: string };
  index: number;
  from?: string;
}) => {
  const navigation = useNavigation<CollectionNavigatorProps>();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withSpring(1, { damping: 15, stiffness: 100 }));
    translateY.value = withDelay(index * 100, withSpring(0, { damping: 15, stiffness: 100 }));
  }, [opacity, translateY, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  const handleOnDetailCollection = ({ title, id }: { id: string; title: string }) => {
    navigation.navigate('HomeStack', {
      screen: 'CollectionCatalogue',
      params: { id, title, from: from || '' }
    });
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={{
          height: 32,
          borderWidth: 1,
          borderRadius: 24,
          justifyContent: 'center',
          paddingHorizontal: 12,
          marginRight: 12,
          marginBottom: 12,
          borderColor: colors.secondary
        }}
        onPress={() => handleOnDetailCollection({ id: item.id, title: item.name })}
      >
        <Text
          label={item.name}
          variant="medium"
          fontWeight="regular"
          color={colors.dark.blackCoral}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
