import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React, { useEffect, useState } from 'react';
import { Animated, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { AccordionProps } from './Accordion.type';

const AccordionContainer = styled.TouchableOpacity`
  gap: 12px;
  margin-bottom: 12px;
`;

const Border = styled(View)`
  border: 1px solid ${colors.dark.solitude};
`;

export const Accordion = ({
  label,
  childData,
  description,
  expanded,
  onToggle = () => undefined
}: AccordionProps) => {
  const [rotateAnimation, setRotateAnimation] = useState(
    expanded ? new Animated.Value(0) : new Animated.Value(1)
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    setRotateAnimation(expanded ? new Animated.Value(0) : new Animated.Value(1));
  }, [expanded]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();

    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const rotateInterpolation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg']
  });

  return (
    <>
      <AccordionContainer onPress={toggleExpand}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text label={label} variant="small" color={colors.dark.blackCoral} />
          <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
            <Icon name="chevronDown" size="16" fill={colors.dark.gumbo} />
          </Animated.View>
        </View>
        {description && <Text label={'asd'} variant="extra-small" color={colors.dark.gumbo} />}
      </AccordionContainer>
      {expanded
        ? childData?.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', marginBottom: 8, marginHorizontal: 4 }}
            >
              <Text
                label={`${(index + 1).toString()}. `}
                variant="extra-small"
                color={colors.dark.gumbo}
              />
              <Text
                label={item.label}
                variant="extra-small"
                color={colors.dark.gumbo}
                style={{ marginRight: 12 }}
              />
            </View>
          ))
        : null}
      <Border />
    </>
  );
};
