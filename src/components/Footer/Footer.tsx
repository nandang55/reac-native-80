import BgFooter from 'assets/images/bg-footer.svg';
import { Text } from 'components/Text';
import config from 'config';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

import { FooterProps } from './Footer.type';

const BackgroundFooter = styled(BgFooter)`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
`;

const FooterText = styled(View)`
  bottom: 24px;
  position: absolute;
  width: 100%;
`;

const Footer = ({ footerText }: FooterProps) => {
  const AppWhitelabel = config.appWhitelabel;

  return (
    <>
      <BackgroundFooter width="100%" />
      <FooterText>
        <Text
          label={
            footerText ||
            `© ${AppWhitelabel === 'SRICANDY' ? 'SriCandy' : 'Sparkle'} v${
              config.appVersion
            }, ${new Date().getFullYear()}`
          }
          textAlign="center"
          color={colors.light.whiteSolid}
        />
      </FooterText>
    </>
  );
};

export default Footer;
