import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { Text } from 'components/Text';
import config from 'config';
import { AccountContext } from 'contexts/AppAccountContext';
import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

interface EnvListInterface {
  key: string;
  value: string;
}

const ENVConfigurationContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding: 0 16px;
`;

const IconContainer = styled(View)`
  background-color: ${colors.light.whiteSmoke};
  border-radius: 8px;
  padding: 4px;
`;

const renderItem = ({ item, index }: { item: EnvListInterface; index: number }) => {
  const { key, value } = item;
  return (
    <View
      key={index}
      style={{
        borderBottomColor: colors.dark.solitude,
        borderBottomWidth: 1,
        paddingVertical: 16
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text label={`${key} : `} color={colors.dark.gumbo} fontWeight="semi-bold" />
        <View style={{ maxWidth: 250 }}>
          <Text label={`${value}`} color={colors.dark.gumbo} fontWeight="semi-bold" />
        </View>
      </View>
    </View>
  );
};

const AccountConfigEnv = () => {
  const { ...envConfig } = config;
  const envList = Object.entries(envConfig).map(([key, value]) => ({ key, value }));

  const { state: accountState } = useContext(AccountContext);
  const { firstName, lastName } = accountState.account || {};

  return (
    <LayoutScreen statusBarColor={colors.primary} isNoPadding>
      <View style={{ flex: 1, padding: 16, gap: 10 }}>
        <View
          style={{
            backgroundColor: colors.light.whiteSolid,
            borderRadius: 8,
            padding: 16,
            gap: 12,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <IconContainer>
            <Icon name="account" />
          </IconContainer>
          <Text
            label={`${firstName} ${lastName}`}
            fontWeight="bold"
            color={colors.primary}
            numberOfLines={1}
          />
        </View>
        <ENVConfigurationContainer>
          <FlatList
            data={envList}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingTop: 13 }}
            showsVerticalScrollIndicator={false}
          />
        </ENVConfigurationContainer>
      </View>
    </LayoutScreen>
  );
};

export default AccountConfigEnv;
