import { Text } from 'components/Text';
import { AddressSuggestionInterface } from 'interfaces/AddressInterface';
import React, { useState } from 'react';
import {
  FlatList,
  NativeSyntheticEvent,
  Platform,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View
} from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { TextAreaInputInterface } from './TextArea.type';

const InputContainer = styled(View)`
  display: flex;
  gap: 8px;
  position: relative;
  width: 100%;
`;

const TextAreaInputContainerStyled = styled(View)<{ noBorder?: boolean; borderColor: string }>`
  align-items: center;
  background-color: white;
  border: ${(props) => (props.noBorder ? '0px' : '1px')} solid ${(props) => props.borderColor};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const SuggestionItem = styled(TouchableOpacity)`
  padding: 12px;
`;

const Border = styled(View)<{ color?: string }>`
  border: 0.8px solid ${(props) => props.color || colors.dark.silver};
`;

export const InputTextArea = ({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  helperText,
  readonly,
  isError,
  errorText,
  keyboardType,
  numberOfLines,
  maxLength,
  borderStyle,
  isNotTextArea = false,
  showSuggestions,
  suggestionData,
  suggestionOnPress,
  isRequired = false,
  labelStyle,
  helperTextStyle
}: TextAreaInputInterface) => {
  const [inputHeight, setInputHeight] = useState(40);

  const renderItem = ({ item }: { item: AddressSuggestionInterface }) => {
    return (
      <SuggestionItem onPress={() => suggestionOnPress?.(item?.address)} key={item?.address}>
        <Text label={item?.address} color={colors.dark.blackCoral} />
      </SuggestionItem>
    );
  };

  return (
    <InputContainer>
      <View style={{ flex: 1, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
        {label && <Text {...labelStyle} label={label} color={colors.dark.gumbo} />}
        {isRequired && (
          <View
            style={{
              backgroundColor: colors.dark.silver,
              paddingHorizontal: 4,
              paddingVertical: 2,
              marginVertical: 2,
              borderRadius: 100
            }}
          >
            <Text
              label="Required"
              color={colors.dark.gumbo}
              variant="ultra-small"
              fontWeight="regular"
              fontStyle="italic"
            />
          </View>
        )}
      </View>
      <TextAreaInputContainerStyled
        style={borderStyle}
        noBorder={readonly}
        borderColor={isError ? colors.red.fireEngineRed : colors.dark.blackCoral}
      >
        <TextInput
          value={value}
          underlineColorAndroid="transparent"
          style={{
            color: colors.dark.blackCoral,
            minHeight: Platform.OS == 'ios' ? (isNotTextArea ? 40 : 84) : undefined,
            height:
              Platform.OS == 'android' ? (isNotTextArea ? inputHeight : undefined) : undefined,
            width: '100%',
            paddingHorizontal: 16,
            paddingTop: Platform.OS == 'ios' ? 12 : undefined,
            paddingBottom: Platform.OS == 'ios' ? 12 : undefined
          }}
          keyboardType={keyboardType}
          onChangeText={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.dark.gumbo}
          maxLength={maxLength}
          multiline
          textAlignVertical="top"
          numberOfLines={numberOfLines}
          onContentSizeChange={(
            event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
          ) => {
            if (Platform.OS === 'android') {
              setInputHeight(event.nativeEvent.contentSize.height);
            }
          }}
        />
      </TextAreaInputContainerStyled>
      {isError ? (
        <Text label={errorText} color={colors.red.fireEngineRed} />
      ) : (
        helperText && (
          <Text {...helperTextStyle} label={helperText} color={colors.dark.bermudaGrey} />
        )
      )}
      {showSuggestions && (
        <FlatList
          data={suggestionData}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          style={{
            backgroundColor: colors.light.whiteSolid,
            shadowColor: '#171717',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            width: '100%',
            borderWidth: 1,
            borderColor: colors.dark.solitude,
            borderRadius: 12,
            position: 'absolute',
            top: 91,
            zIndex: 9999
          }}
          ItemSeparatorComponent={() => <Border color={colors.dark.solitude} />}
        />
      )}
    </InputContainer>
  );
};
