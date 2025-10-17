import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { BadgeComponent } from 'components/Badge';
import { AccountContext } from 'contexts/AppAccountContext';
import useGetCountCart from 'hooks/useGetCountCart';
import useGetCountWishlist from 'hooks/useGetCountWishlist';
import React, { useContext } from 'react';
import { Platform, View } from 'react-native';
import CategoriesScreen from 'screens/CategoriesScreen';
import CategoryCatalogueScreen from 'screens/CategoryCatalogueScreen';
import CollectionCatalogueScreen from 'screens/CollectionCatalogueScreen';
import ProductTagListScreen from 'screens/ProductTagListScreen';
import { SearchSuggestionScreen } from 'screens/SearchSuggestionScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type CategoriesStackParamList = {
  Categories: undefined;
  SearchSuggestion: { from?: string } | undefined;
  CategoryCatalogue: { title: string; id: string; from?: string };
  CollectionCatalogue: { title: string; id: string };
  ProductTagList: { title: string; tag: string };
};

const Stack = createStackNavigator<CategoriesStackParamList>();

const CategoriesStackNavigator = () => {
  const { state: accountState } = useContext(AccountContext);
  const { data: dataCart, isSuccess: isDataCartSuccess } = useGetCountCart({
    options: { enabled: !!accountState.account }
  });
  const { data: dataWishlist, isSuccess: isDataWishlistSuccess } = useGetCountWishlist({
    options: { enabled: !!accountState.account }
  });

  const MenuOptions = {
    title: 'Categories',
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
  };
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
        headerShadowVisible: true
      }}
      initialRouteName="Categories"
    >
      <Stack.Screen name="Categories" component={CategoriesScreen} options={MenuOptions} />
      <Stack.Screen
        name="SearchSuggestion"
        component={SearchSuggestionScreen}
        options={{
          ...MenuOptions,
          cardStyleInterpolator: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            };
          }
        }}
      />
      <Stack.Screen
        name="CategoryCatalogue"
        component={CategoryCatalogueScreen}
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
        name="CollectionCatalogue"
        component={CollectionCatalogueScreen}
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
        name="ProductTagList"
        component={ProductTagListScreen}
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
    </Stack.Navigator>
  );
};

export default CategoriesStackNavigator;
