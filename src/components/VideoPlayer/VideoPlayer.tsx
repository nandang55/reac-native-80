import { Icon } from 'components/Icon';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { VideoPlayerProps } from './VideoPlayer.type';

const { width } = Dimensions.get('screen');

const Container = styled.View`
  height: 100%;
  width: ${width}px;
`;

const VideoWrapper = styled.View`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const StyledVideo = styled(Video)`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const Controls = styled.View`
  align-items: center;
  bottom: 0;
  flex-direction: row;
  left: 0;
  padding: 10px;
  position: absolute;
  right: 0;
`;

const ThumbnailContainer = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Thumbnail = styled(Image)`
  height: 100%;
  width: 100%;
`;

const PlayButtonWrapper = styled.View`
  background-color: ${colors.light.whiteSolid};
  border-radius: 100px;
  padding: 14px;
  position: absolute;
`;

const SoundButton = styled(TouchableOpacity)`
  background-color: ${colors.light.whiteSolid};
  border-radius: 100px;
  bottom: 10px;
  padding: 2px;
  position: absolute;
  right: 18px;
`;

export const VideoPlayer: FC<VideoPlayerProps> = ({
  data,
  muted,
  setMuted,
  initialShowThumbnail = true,
  isFocused,
  onPressVideo,
  onProgress,
  initialTime,
  onEnd
}) => {
  const videoRef = useRef<VideoRef>(null);

  const [showThumbnail, setShowThumbnail] = useState(initialShowThumbnail);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) {
      setShowThumbnail(true);
      setMuted(true);
      videoRef.current?.seek(0);
    } else {
      setShowThumbnail(initialShowThumbnail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handlePlay = () => {
    setShowThumbnail(false);
  };

  const onLoad = () => {
    setLoading(false);
    if (videoRef.current && initialTime && !initialShowThumbnail) {
      videoRef.current.seek(initialTime);
    }
  };

  const handleOnEnd = () => {
    setShowThumbnail(true);
    videoRef.current?.seek(0);
    onEnd?.();
  };

  const toggleMute = () => setMuted(!muted);

  return (
    <Container>
      {showThumbnail ? (
        <ThumbnailContainer onPress={handlePlay}>
          <Thumbnail source={{ uri: data.thumbnail }} />
          <PlayButtonWrapper>
            <Icon name="play" size="47" color={colors.secondary} />
          </PlayButtonWrapper>
        </ThumbnailContainer>
      ) : (
        <TouchableWithoutFeedback onPress={onPressVideo}>
          <VideoWrapper>
            <StyledVideo
              ref={videoRef}
              source={{ uri: data.url }}
              resizeMode="contain"
              onLoad={onLoad}
              onEnd={handleOnEnd}
              paused={showThumbnail}
              muted={muted}
              onProgress={onProgress}
              controls={false}
            />
            {!loading && (
              <Controls>
                {!showThumbnail && (
                  <SoundButton onPress={toggleMute}>
                    <Icon
                      name={muted ? 'soundOff' : 'soundOn'}
                      size="28"
                      color={colors.secondary}
                    />
                  </SoundButton>
                )}
              </Controls>
            )}
          </VideoWrapper>
        </TouchableWithoutFeedback>
      )}
    </Container>
  );
};
