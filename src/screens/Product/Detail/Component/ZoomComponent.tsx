import { useZoomGesture } from 'hooks/ImageZoom/useZoomGesture';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { ZoomProps } from './ZoomComponentProps';

export const ZoomComponent = (props: PropsWithChildren<ZoomProps>) => {
  const { style, contentContainerStyle, children, ...rest } = props;

  const { zoomGesture, onLayout, onLayoutContent, contentContainerAnimatedStyle } = useZoomGesture({
    ...rest
  });

  return (
    <GestureDetector gesture={zoomGesture}>
      <View style={[styles.container, style]} onLayout={onLayout} collapsable={false}>
        <Animated.View
          style={[contentContainerAnimatedStyle, contentContainerStyle]}
          onLayout={onLayoutContent}
        >
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
});
