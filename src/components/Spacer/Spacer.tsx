import React from 'react';
import { View } from 'react-native';

import { SpacerProps } from './Spacer.type';

const Spacer = ({ w, h }: SpacerProps) => {
  return <View style={{ width: w, height: h }} />;
};

export default Spacer;
