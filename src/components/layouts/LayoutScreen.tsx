import { Footer } from 'components/Footer';
import React, { ReactNode } from 'react';
import {
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { LayoutScreenProps, LayoutStyledProps } from './LayoutScreen.type';

const ScrollViewStyled = styled(KeyboardAwareScrollView)<LayoutStyledProps>`
  background-color: ${(props) => props.backgroundColor ?? colors.light.whiteSmoke};
  flex: 1;
  padding: ${(props) => (props.isNoPadding ? '0' : '16px')};
`;

const ViewStyled = styled(View)<LayoutStyledProps>`
  background-color: ${(props) => props.backgroundColor ?? colors.light.whiteSmoke};
  flex: 1;
  padding: ${(props) => (props.isNoPadding ? '0' : '16px')};
`;

const LayoutScreen = ({
  children,
  backgroundColor = colors.light.whiteSmoke,
  isScrollable,
  statusBarColor = colors.primary,
  isNoPadding: isDisablePadding,
  isRefreshing = false,
  scrollViewContentStyle,
  onRefresh,
  bottomSafeAreaColor,
  isFooter,
  footerText,
  hasForm = false
}: LayoutScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} translucent />
      <Wrapper hasForm={hasForm}>
        <View
          style={{
            flex: 1,
            paddingTop: isDisablePadding ? 0 : insets.top
          }}
        >
          {isScrollable ? (
            <ScrollViewStyled
              showsVerticalScrollIndicator={false}
              backgroundColor={backgroundColor}
              isNoPadding={isDisablePadding}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={() => onRefresh?.()} />
              }
              contentContainerStyle={scrollViewContentStyle}
            >
              {children}
            </ScrollViewStyled>
          ) : (
            <ViewStyled backgroundColor={backgroundColor} isNoPadding={isDisablePadding}>
              {children}
              {isFooter && <Footer footerText={footerText} />}
            </ViewStyled>
          )}
          {!!bottomSafeAreaColor && (
            <SafeAreaView style={{ flex: 0, backgroundColor: bottomSafeAreaColor }} />
          )}
        </View>
      </Wrapper>
    </>
  );
};

const Wrapper = ({ children, hasForm }: { children: ReactNode; hasForm: boolean }) => {
  return hasForm ? (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  ) : (
    children
  );
};

export default LayoutScreen;
