import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { BadgeComponent } from 'components/Badge';
import { AccountContext } from 'contexts/AppAccountContext';
import useGetCountCart from 'hooks/useGetCountCart';
import useGetCountWishlist from 'hooks/useGetCountWishlist';
import { MediaInterface } from 'interfaces/ProductDetailInterface';
import React, { useContext } from 'react';
import { Platform, View } from 'react-native';
import { VideoImageViewer } from 'screens/Product';
import ProductDetailScreen from 'screens/ProductDetailScreen';
import RecommendedProductScreen from 'screens/RecommendedProductScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type ProductStackParamList = {
  ProductDetail: {
    id: string;
    title: string;
    variant_id?: string;
    from?: string;
  };
  SimilarCatalogue: { id: string; title: string };
  VideoImageViewer:
    | {
        data: Array<MediaInterface & { id: string }>;
        isThumbnail?: boolean;
        isMuted?: boolean;
      }
    | undefined;
};

const Stack = createStackNavigator<ProductStackParamList>();

const ProductStackNavigator = () => {
  const { state: accountState } = useContext(AccountContext);
  const { data: dataCart, isSuccess: isDataCartSuccess } = useGetCountCart({
    options: { enabled: !!accountState.account }
  });
  const { data: dataWishlist, isSuccess: isDataWishlistSuccess } = useGetCountWishlist({
    options: { enabled: !!accountState.account }
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          shadowColor: colors.dark.blackSolid,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 14
        },
        headerTitleAlign: 'left',
        headerTintColor: colors.dark.blackCoral,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
          color: colors.dark.blackCoral,
          marginLeft: -16,
          marginTop: Platform.OS === 'ios' ? 0 : 5
        },
        headerTitleAllowFontScaling: false,
        headerBackTitleVisible: false,
        headerShadowVisible: true,
        headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />
      }}
    >
      <Stack.Screen
        name="SimilarCatalogue"
        component={RecommendedProductScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
              <BadgeComponent
                total={dataWishlist?.data.count || 0}
                isSuccess={isDataWishlistSuccess}
                name="wishlist"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('WishlistStack')}
              />
              <BadgeComponent
                total={dataCart?.data.count || 0}
                isSuccess={isDataCartSuccess}
                name="cart"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
              />
            </View>
          )
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerTitleAllowFontScaling: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
              <BadgeComponent
                total={dataWishlist?.data.count || 0}
                isSuccess={isDataWishlistSuccess}
                name="wishlist"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('WishlistStack')}
              />
              <BadgeComponent
                total={dataCart?.data.count || 0}
                isSuccess={isDataCartSuccess}
                name="cart"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
              />
            </View>
          )
        })}
      />
      <Stack.Screen
        name="VideoImageViewer"
        component={VideoImageViewer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProductStackNavigator;
