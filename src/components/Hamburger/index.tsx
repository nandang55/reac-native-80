// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import colors from 'styles/colors';

interface HamburgerProps {
  active?: boolean;
  color?: string;
  onPress?: () => void;
}

const Hamburger: React.FC<HamburgerProps> = ({
  active = false,
  color = colors.dark.blackCoral,
  onPress
}) => {
  const [isActive, setIsActive] = useState(false);

  const containerAnim = useRef(new Animated.Value(0)).current;
  const topBar = useRef(new Animated.Value(0)).current;
  const bottomBar = useRef(new Animated.Value(0)).current;
  const middleBarOpacity = useRef(new Animated.Value(1)).current;
  const bottomBarMargin = useRef(new Animated.Value(0)).current;
  const topBarMargin = useRef(new Animated.Value(0)).current;
  const marginLeft = useRef(new Animated.Value(0)).current;
  const width = useRef(new Animated.Value(20)).current;
  const gap = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    if (active !== isActive) {
      animate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  const animate = () => {
    setIsActive((prevState) => {
      const newState = !prevState;
      cross(newState);
      return newState;
    });
  };

  const cross = (active: boolean) => {
    if (active) {
      Animated.parallel([
        Animated.spring(topBar, { toValue: 1, useNativeDriver: false }),
        Animated.spring(bottomBar, { toValue: 1, useNativeDriver: false }),
        Animated.spring(bottomBarMargin, { toValue: -7, useNativeDriver: false }),
        Animated.spring(width, { toValue: 28, useNativeDriver: false }),
        Animated.spring(gap, { toValue: 0, useNativeDriver: false }),
        Animated.timing(middleBarOpacity, { toValue: 0, duration: 200, useNativeDriver: false })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(topBar, { toValue: 0, useNativeDriver: false }),
        Animated.spring(bottomBar, { toValue: 0, useNativeDriver: false }),
        Animated.spring(bottomBarMargin, { toValue: 0, useNativeDriver: false }),
        Animated.spring(width, { toValue: 20, useNativeDriver: false }),
        Animated.spring(gap, { toValue: 4, useNativeDriver: false }),
        Animated.timing(middleBarOpacity, { toValue: 1, duration: 200, useNativeDriver: false })
      ]).start();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPress?.();
        animate();
      }}
    >
      <Animated.View
        style={{
          width: 24,
          justifyContent: 'center',
          alignItems: 'center',
          height: 24,
          gap: gap,
          transform: [
            {
              rotate: containerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }
          ]
        }}
      >
        <Animated.View
          style={{
            height: 3.8,
            marginLeft: marginLeft,
            width: width,
            marginBottom: topBarMargin,
            backgroundColor: color,
            borderRadius: 0.8,
            transform: [
              {
                rotate: topBar.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-46deg']
                })
              }
            ]
          }}
        />
        <Animated.View
          style={{
            height: 3.8,
            width: 20,
            opacity: middleBarOpacity,
            backgroundColor: color,
            borderRadius: 0.8
          }}
        />
        <Animated.View
          style={{
            height: 3.8,
            marginLeft: marginLeft,
            width: width,
            backgroundColor: color,
            marginTop: bottomBarMargin,
            borderRadius: 0.8,
            transform: [
              {
                rotate: bottomBar.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '46deg']
                })
              }
            ]
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Hamburger;
