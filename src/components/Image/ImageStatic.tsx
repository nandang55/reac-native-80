import React from 'react';
import { Image as RNImage, ImageSourcePropType } from 'react-native';

import { ImageStaticProps, ImageStaticType } from './ImageStatic.types';

export const ImageStatic = ({ name, size, fullWidth }: ImageStaticProps) => {
  const imageProps = {
    height: size || 16,
    width: size || 16
  };

  const imageName: Record<ImageStaticType, ImageSourcePropType> = {
    ring: require('../../assets/images/ring.png'),
    necklace: require('../../assets/images/necklace.png'),
    paypal: require('../../assets/images/paypal.png')
  };

  return (
    <RNImage source={imageName[name]} {...imageProps} style={fullWidth && { width: '100%' }} />
  );
};
