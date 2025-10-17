// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from 'components/Skeleton';
import { VideoPlayer } from 'components/VideoPlayer';
import { VideoImageBannerInterface } from 'interfaces/ProductInterface';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import colors from 'styles/colors';

import { VideoImageSliderProps } from './VideoImageSlider.type';

const { width } = Dimensions.get('window');

const ITEM_LENGTH = width;
const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2;
const CURRENT_ITEM_TRANSLATE_Y = 0;

export const VideoImageSlider: FC<VideoImageSliderProps> = ({
  data,
  withIndicator = true,
  absoluteIndicator,
  autoplay,
  height,
  spacing = 0,
  borderRadius = 0,
  isLoading,
  onPress = () => {},
  isFocused = true,
  initialShowThumbnail = true,
  onLayout,
  currentIndex,
  setCurrentIndex,
  currentTime,
  onEnd
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const [muted, setMuted] = useState<boolean>(true);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (autoplay) {
      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        if (nextIndex >= 0) {
          flatListRef.current?.scrollToIndex({
            animated: true,
            index: nextIndex
          });
          setCurrentIndex(nextIndex);
        }
      }, 2000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, currentIndex, data.length]);

  const handleOnViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any }) => {
    const itemsInView = viewableItems.filter(
      ({ item }: { item: VideoImageBannerInterface }) => item.thumbnail
    );

    if (itemsInView.length === 0) {
      return;
    }

    setCurrentIndex(itemsInView[0].index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getItemLayout = (_data: any, index: number) => ({
    length: ITEM_LENGTH,
    offset: ITEM_LENGTH * (index - 0),
    index
  });

  const viewabilityConfig = {
    waitForInteraction: Platform.OS === 'android' ? false : true,
    itemVisiblePercentThreshold: Platform.OS === 'android' ? 50 : 100
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged: handleOnViewableItemsChanged }
  ]);

  if (isLoading) {
    return <Skeleton width={width} height={height} style={{ borderRadius: 2 }} />;
  }

  return (
    <SafeAreaView
      onLayout={onLayout}
      style={(styles.container, { marginBottom: absoluteIndicator ? 0 : -30 })}
    >
      <FlatList
        key={currentIndex}
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => {
          if (!item.thumbnail) return <View style={{ width: EMPTY_ITEM_LENGTH }} />;
          const isActive = index === currentIndex;

          const inputRange = [
            (index - 1) * ITEM_LENGTH,
            (index - 0) * ITEM_LENGTH,
            index * ITEM_LENGTH
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [
              CURRENT_ITEM_TRANSLATE_Y * 1,
              CURRENT_ITEM_TRANSLATE_Y,
              CURRENT_ITEM_TRANSLATE_Y * 1
            ],
            extrapolate: 'clamp'
          });

          return (
            <View style={{ width: ITEM_LENGTH }}>
              <Animated.View
                style={[
                  {
                    transform: [{ translateY }],
                    marginHorizontal: spacing,
                    borderRadius: borderRadius + spacing * 2
                  },
                  styles.itemContent
                ]}
              >
                {item.type === 'video' ? (
                  <VideoPlayer
                    data={item}
                    muted={muted}
                    setMuted={setMuted}
                    initialShowThumbnail={initialShowThumbnail}
                    initialTime={currentTime ?? 0}
                    isFocused={isActive && isFocused}
                    onPressVideo={() =>
                      onPress({
                        id: item.id,
                        title: item.name || '',
                        currentIndex: currentIndex || 0,
                        isMuted: muted
                      })
                    }
                    onEnd={onEnd}
                  />
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      onPress({
                        id: item.id,
                        title: item.name || '',
                        currentIndex: currentIndex || 0
                      })
                    }
                  >
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={[{ borderRadius: borderRadius }, styles.itemImage]}
                    />
                  </TouchableWithoutFeedback>
                )}
              </Animated.View>
            </View>
          );
        }}
        initialScrollIndex={currentIndex || 0}
        getItemLayout={getItemLayout}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        keyExtractor={(item) => item.id}
        bounces={false}
        decelerationRate={Platform.OS === 'android' ? 'normal' : 0}
        renderToHardwareTextureAndroid
        contentContainerStyle={[{ height }, styles.flatListContent]}
        snapToInterval={ITEM_LENGTH}
        snapToAlignment="start"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false
        })}
        scrollEventThrottle={16}
        disableIntervalMomentum
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs?.current}
        viewabilityConfig={viewabilityConfig}
      />
      {withIndicator && data.length > 1 && (
        <View
          style={[
            styles.indicatorContainer,
            { position: absoluteIndicator ? 'absolute' : 'relative' }
          ]}
        >
          {data.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentIndex(index);
                flatListRef.current?.scrollToIndex({
                  animated: true,
                  index: index
                });
              }}
            >
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor:
                      currentIndex === index ? colors.secondary : colors.dark.bermudaGrey
                  }
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', width: ITEM_LENGTH },
  flatListContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContent: {
    alignItems: 'center',
    backgroundColor: 'white'
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 100,
    left: 0,
    right: 0,
    height: Platform.OS == 'ios' ? 45 : 35,
    backgroundColor: 'transparent',
    bottom: 0
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  }
});
