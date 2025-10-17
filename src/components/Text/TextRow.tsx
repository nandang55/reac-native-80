import React from 'react';
import { View } from 'react-native';

import Text from './Text';
import { TextRowProps } from './TextRow.type';

const TextRow = ({ label, value, labelProps, valueProps }: TextRowProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <Text label={label} {...labelProps} />
      <Text label={value} {...valueProps} />
    </View>
  );
};

export default TextRow;
