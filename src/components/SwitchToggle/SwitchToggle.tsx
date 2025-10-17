import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from 'styles/colors';

import { SwitchToggleInterface } from './SwitchToggle.type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

function SwitchToggle({
  switchOn,
  onPress,
  containerStyle,
  circleStyle,
  backgroundColorOn = colors.dark.blackSolid,
  backgroundColorOff = '#C4C4C4',
  backgroundImageOn,
  backgroundImageOff,
  circleColorOn = colors.light.whiteSolid,
  circleColorOff = '#6D6D6D',
  duration = 300,
  buttonStyle,
  disabled = false
}: SwitchToggleInterface): React.ReactElement {
  const [animXValue] = useState(new Animated.Value(switchOn ? 1 : 0));

  const runAnimation = (): void => {
    const animValue = {
      fromValue: switchOn ? 0 : 1,
      toValue: switchOn ? 1 : 0,
      duration,
      useNativeDriver: false
    };

    Animated.timing(animXValue, animValue).start();
  };

  const endPos =
    containerStyle && circleStyle
      ? (containerStyle.width as number) -
        ((circleStyle.width as number) + ((containerStyle.padding as number) || 0) * 2)
      : 0;

  const circlePosXEnd = endPos;
  const [circlePosXStart] = useState(0);

  const prevSwitchOnRef = useRef<boolean>();
  const prevSwitchOn = !!prevSwitchOnRef.current;

  useEffect(() => {
    prevSwitchOnRef.current = switchOn;

    if (prevSwitchOn !== switchOn) runAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevSwitchOn, switchOn]);

  const generateLeftIcon = (): React.ReactElement => {
    return <View style={{ position: 'absolute', left: 5 }}>{backgroundImageOn}</View>;
  };

  const generateRightIcon = (): React.ReactElement => {
    return <View style={{ position: 'absolute', right: 5 }}>{backgroundImageOff}</View>;
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor: animXValue.interpolate({
              inputRange: [0, 1],
              outputRange: [
                backgroundColorOff as string | number,
                backgroundColorOn as string | number
              ] as Array<string> | Array<number>
            })
          }
        ]}
      >
        {switchOn && generateLeftIcon()}
        <Animated.View
          style={[
            circleStyle,
            {
              backgroundColor: animXValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  circleColorOff as string | number,
                  circleColorOn as string | number
                ] as Array<string> | Array<number>
              })
            },
            {
              transform: [
                {
                  translateX: animXValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      circlePosXStart as string | number,
                      circlePosXEnd as string | number
                    ] as Array<string> | Array<number>
                  })
                }
              ]
            },
            buttonStyle
          ]}
        />
        {!switchOn && generateRightIcon()}
      </Animated.View>
    </TouchableOpacity>
  );
}

export { SwitchToggle };
