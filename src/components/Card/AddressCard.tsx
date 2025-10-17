/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */

import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { RadioButton } from 'react-native-radio-buttons-group';
import styled from 'styled-components';
import colors from 'styles/colors';

import {
  AddressCardInterface,
  AddressIconTypes,
  AddressScreenVariant,
  CheckoutPickAddressInterface
} from './AddressCard.type';

const Heading = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Badge = styled(View)`
  background-color: ${colors.dark.silver};
  border-radius: 50px;
  padding: 4px 8px;
`;

const Border = styled(View)`
  border: 0.5px solid ${colors.dark.bermudaGrey};
  margin: 8px 0;
`;

const style = (variant: AddressScreenVariant, selected?: CheckoutPickAddressInterface) => {
  let borderColor = colors.red.deepPink;
  let backgroundColor = colors.red.softPink;

  if (['checkout', 'account'].includes(variant) || (variant === 'checkout_delivery' && !selected)) {
    borderColor = colors.dark.blackCoral;
    backgroundColor = colors.light.whiteSolid;
  }

  return StyleSheet.create({
    container: {
      backgroundColor,
      borderColor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 8,
      padding: 16
    }
  });
};

const AddressIcon = ({ variant, selected, onPress }: AddressIconTypes) => {
  if (variant === 'account') {
    return <Icon name="more" size="16px" color={colors.dark.blackCoral} />;
  }

  if (variant === 'checkout_delivery') {
    if (selected) {
      return (
        <RadioButton
          id={selected.id}
          onPress={onPress}
          selected={Boolean(selected.id)}
          size={20}
          borderColor={colors.secondary}
          color={colors.secondary}
        />
      );
    }
    return <RadioButton onPress={onPress} id="" selected={false} size={16} />;
  }

  return (
    <Icon
      name="chevronRight"
      size="16px"
      color={colors.light.whiteSolid}
      stroke={colors.dark.blackCoral}
    />
  );
};

const CardContainer = ({
  isTouchable,
  variant,
  selected,
  children,
  onPress
}: PropsWithChildren<{
  variant: AddressScreenVariant;
  isTouchable: boolean;
  selected?: CheckoutPickAddressInterface;
  onPress: () => void;
}>) => {
  if (isTouchable) {
    return (
      <TouchableOpacity onPress={onPress} style={style(variant, selected).container}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={style(variant).container}>{children}</View>;
};

export const AddressCard = ({
  id,
  address,
  postal_code,
  province_name,
  city_name,
  area_name,
  label,
  receipt_name,
  receipt_phone,
  is_primary,
  variant = 'account',
  selected,
  onPress,
  onPressEdit,
  onSettings,
  floor_or_unit
}: AddressCardInterface) => {
  const { t } = useTranslation(['address']);
  const isActive = ['checkout_delivery', 'checkout'].includes(variant);
  const handler = () => (onPress ? onPress() : undefined);

  const labelAddress =
    Config.APP_REGION === 'sg'
      ? `${address}${floor_or_unit ? ' ' + floor_or_unit : ''}, Singapore ${postal_code}`
      : `${address}, Kec. ${area_name}, ${city_name}, ${province_name} ${postal_code}`;

  return (
    <CardContainer
      onPress={() => (isActive && onPress ? onPress() : onPressEdit(id, is_primary))}
      selected={selected}
      isTouchable={isActive}
      variant={variant}
    >
      <Heading>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Text
            label={label}
            variant="large"
            color={colors.dark.blackCoral}
            fontWeight="semi-bold"
          />
          {is_primary && (
            <Badge>
              <Text
                label={t('address:delivery.primary')}
                variant="extra-small"
                color={colors.dark.gumbo}
                fontWeight="semi-bold"
                textAlign="center"
              />
            </Badge>
          )}
        </View>

        <TouchableOpacity
          onPress={() => (isActive && onPress ? onPress() : onPressEdit(id, is_primary))}
        >
          <AddressIcon
            onPress={handler}
            variant={variant}
            isPrimary={is_primary}
            selected={selected}
          />
        </TouchableOpacity>
      </Heading>
      <Border />
      <View style={{ display: 'flex', gap: 16 }}>
        <View>
          <Text
            label={receipt_name}
            variant="small"
            fontWeight="bold"
            color={colors.dark.blackCoral}
          />
          <Text label={receipt_phone} variant="small" color={colors.dark.gumbo} />
        </View>
        <Text label={labelAddress} variant="small" color={colors.dark.gumbo} />
      </View>
      <SettingsContainer variant={variant}>
        <Button
          variant="secondary"
          label={t('common.settings')}
          onPress={() => {
            if (onSettings) {
              onSettings.ref.current?.snapToIndex(0);
              onSettings.setModifyAddress({ id, isPrimary: is_primary });
            }
          }}
          borderRadius="48px"
          fontWeight="semi-bold"
          textColor={colors.dark.gumbo}
          size="small"
          color={colors.light.whiteSolid}
        />
      </SettingsContainer>
    </CardContainer>
  );
};

function SettingsContainer({
  variant,
  children
}: {
  variant: AddressScreenVariant;
  children: React.ReactNode;
}) {
  if (variant == 'checkout_delivery') {
    return <View style={{ marginTop: 12 }}>{children}</View>;
  }
  return null;
}
