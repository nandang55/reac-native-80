import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'components/Text';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useEffect } from 'react';
import { FlatList, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type ScreenProps = StackNavigationProp<RootStackParamList>;

const StyledItem = styled(TouchableOpacity)`
  align-items: center;
  flex-direction: row;
  gap: 12px;
  padding: 16px;
`;

export const CategoriesList = ({
  data,
  from
}: {
  data: Array<{ id: string; name: string }>;
  from?: string;
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <RenderItem item={item} index={index} from={from} />}
      keyExtractor={(item) => item.name}
      scrollEnabled={false}
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
  const navigation = useNavigation<ScreenProps>();

  const handleOnDetailCategory = ({ id, title }: { id: string; title: string }) => {
    navigation.navigate('CategoriesStack', {
      screen: 'CategoryCatalogue',
      params: { id, title, from: from || '' }
    });
  };

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withSpring(1, { damping: 15, stiffness: 100 }));
    translateY.value = withDelay(index * 100, withSpring(0, { damping: 15, stiffness: 100 }));
  }, [opacity, translateY, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
      width: '100%'
    };
  });

  const categoryImg: Record<string, ImageSourcePropType> = {
    Bracelets: require('../../../assets/images/category-img/Bracelets.png'),
    Earrings: require('../../../assets/images/category-img/Earrings.png'),
    Necklaces: require('../../../assets/images/category-img/Necklaces.png'),
    Rings: require('../../../assets/images/category-img/Rings.png')
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          borderBottomWidth: 1,
          borderColor: colors.dark.solitude,
          marginBottom: 2
        }
      ]}
    >
      <StyledItem onPress={() => handleOnDetailCategory({ id: item.id, title: item.name })}>
        <Image source={categoryImg[item.name]} style={{ width: 32, height: 32 }} />
        <Text label={item.name} variant="medium" color={colors.dark.blackCoral} />
      </StyledItem>
    </Animated.View>
  );
};
