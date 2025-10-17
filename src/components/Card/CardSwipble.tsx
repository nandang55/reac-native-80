import React from 'react';
import { Swipeable } from 'react-native-gesture-handler';

import { CardSwipeableInterface } from './CardSwipeable';

const CardSwipeable = ({
  renderRightActions,
  leftRightActions,
  children
}: CardSwipeableInterface) => {
  return (
    <Swipeable renderLeftActions={leftRightActions} renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};

export default CardSwipeable;
