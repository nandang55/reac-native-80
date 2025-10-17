import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { Text as RNText, View } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { StepIndicatorStyles } from 'react-native-step-indicator/lib/typescript/src/types';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import { StepperInterface } from './Stepper.type';

const indicatorStyles: StepIndicatorStyles = {
  stepIndicatorSize: 64,
  currentStepIndicatorSize: 64,
  stepStrokeWidth: 3,
  stepStrokeCurrentColor: colors.secondary,
  stepStrokeFinishedColor: colors.secondary,
  stepStrokeUnFinishedColor: colors.dark.solitude,
  separatorUnFinishedColor: colors.dark.solitude,
  stepIndicatorFinishedColor: colors.light.whiteSolid,
  stepIndicatorUnFinishedColor: colors.light.whiteSolid,
  stepIndicatorCurrentColor: colors.secondary,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: colors.dark.blackCoral,
  labelSize: 12,
  currentStepLabelColor: colors.dark.blackCoral,
  labelFontFamily: 'Poppins-SemiBold'
};

const StepIndicatorContainer = styled(View)`
  background-color: ${colors.red.newPink2};
  border-radius: 8px;
  gap: 8px;
  padding: 12px;
`;

const HeaderStepperStyled = styled(View)`
  align-items: center;
  justfiy-content: center;
  text-align: center;
`;

export const Stepper = ({
  labels,
  stepCount,
  currentPosition,
  currentFree,
  currentDiscount,
  nextFree,
  nextDiscount,
  remainingPrice
}: StepperInterface) => {
  return (
    <StepIndicatorContainer>
      <HeaderStepperStyled>
        <Text
          label="UNLOCK VOUCHERS!"
          variant="medium"
          fontWeight="semi-bold"
          color={colors.dark.blackCoral}
        />
        {currentFree && (
          <RNText
            allowFontScaling={false}
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              color: colors.dark.blackCoral,
              includeFontPadding: false,
              fontStyle: 'normal'
            }}
          >
            You get free shipping
            {(currentDiscount || 0) > 0 && ` + ${currencyFormatter(currentDiscount || 0)} off`}.
          </RNText>
        )}
      </HeaderStepperStyled>
      <StepIndicator
        stepCount={stepCount}
        customStyles={{
          ...indicatorStyles,
          separatorFinishedColor: currentPosition === -1 ? colors.dark.solitude : colors.secondary
        }}
        currentPosition={currentPosition}
        labels={labels}
        renderStepIndicator={({ stepStatus }) => {
          const unfinished = stepStatus === 'unfinished';
          const current = stepStatus === 'current';

          return (
            <Icon
              name={unfinished ? 'voucherBig' : 'checkedCircleOutlineBig'}
              size={unfinished ? '64' : '32'}
              color={
                unfinished
                  ? colors.dark.gumbo
                  : current
                    ? colors.light.whiteSolid
                    : colors.secondary
              }
            />
          );
        }}
      />
      {(nextFree || (nextDiscount || 0) > 0) && (
        <RNText
          allowFontScaling={false}
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            color: colors.dark.blackCoral,
            includeFontPadding: false,
            fontStyle: 'normal',
            textAlign: 'center'
          }}
        >
          Add {currencyFormatter(remainingPrice || 0)} to get free shipping
          {(nextDiscount || 0) > 0 && ` + ${currencyFormatter(nextDiscount || 0)} off`}.
        </RNText>
      )}
    </StepIndicatorContainer>
  );
};
