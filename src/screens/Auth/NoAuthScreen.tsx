import { LayoutScreen } from 'components/layouts';
import { NoLogin } from 'components/NoLogin';
import React from 'react';
import colors from 'styles/colors';

const NoAuthScreen = () => {
  return (
    <LayoutScreen isNoPadding backgroundColor={colors.light.whiteSolid}>
      <NoLogin />
    </LayoutScreen>
  );
};

export default NoAuthScreen;
