import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import config from 'config';
import { AccountContext } from 'contexts/AppAccountContext';
import { CategoriesStackParamList } from 'navigators/CategoriesStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { isValidElement, useContext } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

interface MenuItemInterface {
  id: string;
  label: string | React.ReactNode;
  onPress: () => void;
}

type MenuDrawerScreenNavigationProps = StackNavigationProp<
  RootStackParamList & CategoriesStackParamList
>;

const MenuDrawerContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  justify-content: space-between;
  padding-bottom: 14px;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-between;
  padding: 14px;
`;

const StyledAuthButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${colors.red.flamingoPink};
  border-radius: 12px;
  flex-direction: row;
  gap: 12px;
  padding: 14px;
`;

const MenuDrawerScreen = () => {
  const { state: accountState } = useContext(AccountContext);

  const navigation = useNavigation<MenuDrawerScreenNavigationProps>();

  const data: Array<MenuItemInterface> = [
    {
      id: '1',
      label: 'Shop by Category',
      onPress: () => navigation.navigate('CategoriesStack', { screen: 'Categories' })
    },
    {
      id: '2',
      label: (
        <View style={{ flexDirection: 'row' }}>
          <Text label="Best of Sri" variant="medium" color={colors.dark.blackCoral} />
          <Text label="Candy" variant="medium" color={colors.secondary} />
        </View>
      ),
      onPress: () =>
        navigation.navigate('CategoriesStack', {
          screen: 'ProductTagList',
          params: { tag: 'best-of-sricandy', title: 'Best of SriCandy' }
        })
    },
    {
      id: '3',
      label: 'Latest Collections',
      onPress: () => navigation.navigate('HomeStack', { screen: 'LatestCollections' })
    }
  ];

  const renderItem = ({ item }: { item: MenuItemInterface }) => {
    return (
      <StyledButton
        style={{
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.17,
          shadowRadius: 2.54,
          elevation: 3
        }}
        onPress={item.onPress}
      >
        {isValidElement(item.label) ? (
          item.label
        ) : (
          <Text label={item.label as string} variant="medium" color={colors.dark.blackCoral} />
        )}
        <Icon
          name="chevronRight"
          color={colors.light.whiteSolid}
          stroke={colors.dark.gumbo}
          size="16"
        />
      </StyledButton>
    );
  };

  const ContactUs = () => {
    return (
      <View style={{ gap: 9 }}>
        <Text
          label="Have some questions or issue?"
          variant="small"
          color={colors.dark.blackCoral}
          textAlign="center"
        />
        <TouchableOpacity onPress={() => navigation.navigate('ContactUs')}>
          <Text
            label="Contact Us"
            variant="small"
            fontWeight="semi-bold"
            color={colors.secondary}
            textDecoration="underline"
            textAlign="center"
            style={{ textDecorationColor: colors.secondary }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const AuthButton = () => {
    return (
      <View style={{ gap: 24 }}>
        <StyledAuthButton
          onPress={() =>
            navigation.navigate('AuthenticationStack', {
              screen: 'NoLogin',
              params: { title: 'Menu' }
            })
          }
        >
          <Icon name="account" color={'transparent'} stroke={colors.light.whiteSolid} size="32" />
          <View>
            <Text label="Guest User" variant="medium" color={colors.light.whiteSolid} />
            <Text
              label="Tap to Login / Register"
              variant="medium"
              color={colors.light.whiteSolid}
            />
          </View>
        </StyledAuthButton>
        <ContactUs />
      </View>
    );
  };

  return (
    <LayoutScreen statusBarColor={colors.primary} isNoPadding>
      <MenuDrawerContainer>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Spacer h={18} />}
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%', height: '100%' }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}
          ListFooterComponent={accountState.account ? <ContactUs /> : <AuthButton />}
          ListFooterComponentStyle={{ paddingTop: 24 }}
        />

        <Text
          label={`© ${config.appWhitelabel === 'SRICANDY' ? 'SriCandy' : 'Sparkle'}, ${new Date().getFullYear()} v${
            config.appVersion
          }`}
        />
      </MenuDrawerContainer>
    </LayoutScreen>
  );
};

export default MenuDrawerScreen;
