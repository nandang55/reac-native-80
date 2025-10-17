/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { Text } from 'components/Text';
import { VideoPlayerContext } from 'contexts/AppVideoPlayerContext';
import { ProductStackParamList } from 'navigators/ProductStackNavigator';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated as Anim,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewToken
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video, { VideoRef } from 'react-native-video';
import colors from 'styles/colors';

import { ZoomComponent } from './Component/ZoomComponent';

const { width } = Dimensions.get('screen');

type VideoImageViewerScreenProps = StackScreenProps<ProductStackParamList, 'VideoImageViewer'>;

const IMAGE_SIZE = 56;
const SPACING = 10;

const VideoImageViewerScreen: React.FC<VideoImageViewerScreenProps> = ({ route }) => {
  const navigation = useNavigation();

  const { currentTime, currentIndex, setIsPlaying, setCurrentTime, setCurrentIndex } =
    useContext(VideoPlayerContext);

  const [activeIndex, setActiveIndex] = useState<number>(currentIndex || 0);
  const [muted, setMuted] = useState<boolean>(route.params?.isMuted || false);
  const [showControls, setShowControls] = useState(true);
  const [paused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);

  const topRef = useRef<FlatList>(null);
  const thumbRef = useRef<FlatList>(null);
  const progressBarWidth = useRef(0);
  const viewabilityConfig = useRef({
    minimumViewTime: 100,
    itemVisiblePercentThreshold: 55
  }).current;
  const videoRef = useRef<VideoRef>(null);

  const onLoad = () => {
    setLoading(false);
  };

  const onEnd = () => {
    if (videoRef.current) {
      videoRef.current?.seek(0);
    }
  };

  const toggleMute = () => setMuted(!muted);

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
      if (info.viewableItems.length) {
        scrollToActiveIndex(Number(info.viewableItems?.[0]?.item?.id));
      }
    },
    []
  );

  const scrollToActiveIndex = (index: number) => {
    setActiveIndex(index);
    setCurrentIndex(index);

    topRef.current?.scrollToOffset({
      offset: index * width,
      animated: true
    });

    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true
      });
    } else {
      thumbRef.current?.scrollToOffset({
        offset: 0,
        animated: true
      });
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <LayoutScreen
      isNoPadding
      backgroundColor={colors.light.whiteSolid}
      statusBarColor="transparent"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            ref={topRef}
            data={route.params?.data}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              const isActive = index === activeIndex;

              if (item.type === 'video') {
                return (
                  <View style={{ ...styles.itemImage, width }}>
                    {isActive ? (
                      <TouchableWithoutFeedback onPress={() => setShowControls(!showControls)}>
                        <Video
                          ref={videoRef}
                          source={{ uri: item.url }}
                          poster={{ source: { uri: item.thumbnail }, resizeMode: 'contain' }}
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                          resizeMode="contain"
                          onLoad={(data) => {
                            setDuration(data.duration);
                            onLoad();
                          }}
                          onProgress={(data) => setCurrentTime(data.currentTime)}
                          onEnd={onEnd}
                          paused={paused}
                          muted={muted}
                          controls={false}
                        />
                      </TouchableWithoutFeedback>
                    ) : (
                      <Image
                        source={{ uri: item.thumbnail }}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                      />
                    )}
                    {isActive && showControls && !loading && (
                      <View style={styles.control}>
                        <View
                          onLayout={(e) => {
                            progressBarWidth.current = e.nativeEvent.layout.width;
                          }}
                          onStartShouldSetResponder={() => true}
                          onResponderGrant={(e) => {
                            const clickX = e.nativeEvent.locationX;
                            const percent = clickX / progressBarWidth.current;
                            const newTime = percent * duration;
                            videoRef.current?.seek(newTime);
                            setCurrentTime(newTime);
                          }}
                          style={{
                            height: 6,
                            width: width,
                            backgroundColor: colors.light.whiteSmoke,
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: 0
                          }}
                        >
                          <View
                            style={{
                              height: '100%',
                              width: `${(currentTime / duration) * 100}%`,
                              backgroundColor: colors.secondary
                            }}
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            paddingHorizontal: 10,
                            marginBottom: 16
                          }}
                        >
                          <Text
                            label={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                            color={colors.light.whiteSolid}
                          />

                          <TouchableOpacity style={styles.soundButton} onPress={toggleMute}>
                            <Icon
                              name={muted ? 'soundOff' : 'soundOn'}
                              size="28"
                              color={colors.secondary}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              } else {
                return <ImageZoom uri={item.thumbnail} />;
              }
            }}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            initialScrollIndex={activeIndex}
            getItemLayout={(_data, index) => ({
              length: width,
              offset: width * index,
              index
            })}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                topRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setIsPlaying(true);
              navigation.goBack();
            }}
            style={{
              position: 'absolute',
              left: 16,
              top: Platform.OS === 'ios' ? 16 * 2 : 16,
              width: 24,
              height: 24,
              backgroundColor: colors.dark.silver,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4
            }}
          >
            <Icon name="arrowLeft" size="16px" color={colors.dark.blackCoral} />
          </TouchableOpacity>
        </View>
        {route.params?.isThumbnail && route.params?.data?.[activeIndex]?.type === 'photo' && (
          <View
            style={{
              backgroundColor: colors.dark.blackSolid,
              paddingBottom: Platform.OS === 'ios' ? 16 * 2 : 16,
              alignItems: 'center',
              width: width,
              flexDirection: 'column',
              gap: 8
            }}
          >
            <View
              style={{
                marginTop: 8,
                backgroundColor: colors.dark.silver,
                height: 16,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 24,
                paddingHorizontal: 8,
                paddingVertical: 2
              }}
            >
              <Text
                label={`${String(activeIndex + 1)}/${String(route.params?.data.length)}`}
                variant="extra-small"
                color={colors.dark.gumbo}
              />
            </View>
            <FlatList
              ref={thumbRef}
              data={route.params?.data}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: SPACING,
                width: width,
                marginLeft: -2,
                justifyContent: 'center'
              }}
              renderItem={({ item, index }) => (
                <ThumbnailImage
                  uri={item.thumbnail}
                  isActive={activeIndex === index}
                  onPress={() => scrollToActiveIndex(index)}
                  index={index}
                />
              )}
            />
          </View>
        )}
      </SafeAreaView>
    </LayoutScreen>
  );
};

const ThumbnailImage = ({
  uri,
  isActive,
  onPress,
  index
}: {
  uri: string;
  isActive: boolean;
  onPress: () => void;
  index: number;
}) => {
  const borderColor = useRef(new Anim.Value(0)).current;
  const fadeAnim = useRef(new Anim.Value(0)).current;
  const translateX = useRef(new Anim.Value(50)).current;

  const delay = index * 100;

  useEffect(() => {
    Anim.sequence([
      Anim.delay(delay),
      Anim.timing(translateX, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
    Anim.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
    Anim.timing(borderColor, {
      toValue: isActive ? 1 : 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [index, isActive]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Anim.View
        style={{
          width: IMAGE_SIZE,
          height: 64,
          justifyContent: 'flex-end',
          backgroundColor: colors.dark.blackSolid,
          alignItems: 'center',
          transform: [{ translateX }],
          gap: 4
        }}
      >
        {isActive && (
          <View
            style={{
              width: IMAGE_SIZE,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.secondary
            }}
          />
        )}
        <Anim.Image
          source={{ uri }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: 4,
            opacity: fadeAnim
          }}
          onLoad={() => {
            Anim.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
          }}
        />
      </Anim.View>
    </TouchableOpacity>
  );
};

const ImageZoom = ({ uri }: { uri: string }) => {
  const { width: deviceWidth } = useWindowDimensions();
  const [sizeImage, setSizeImage] = useState<{ wImg: number; hImg: number } | null>(null);

  useEffect(() => {
    Image.getSize(uri, (newWidth, newHeight) => {
      if (newWidth && newHeight) {
        setSizeImage({
          wImg: newWidth,
          hImg: newHeight
        });
      }
    });
  }, [uri]);

  const imageWidth = 1100;
  const imageHeight = 910;
  return (
    <ZoomComponent
      doubleTapConfig={{
        defaultScale: 2.5,
        minZoomScale: 1,
        maxZoomScale: 10
      }}
    >
      <Image
        source={{ uri }}
        style={{
          width: deviceWidth,
          height: ((sizeImage?.hImg || imageHeight) * deviceWidth) / (sizeImage?.wImg || imageWidth)
        }}
        resizeMode="contain"
      />
    </ZoomComponent>
  );
};

export default VideoImageViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.blackSolid,
    paddingTop: Platform.OS === 'ios' ? 32 : 0
  },
  itemImage: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 16 * 2 : 16
  },
  control: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    padding: 10,
    position: 'absolute',
    right: 0
  },
  soundButton: {
    backgroundColor: colors.light.whiteSolid,
    borderRadius: 100,
    padding: 2
  }
});
