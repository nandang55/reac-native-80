import React, { createContext, useState } from 'react';

interface VideoPlayerInterface {
  isPlaying: boolean;
  currentTime: number;
  currentIndex: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setCurrentIndex: (currentIndex: number) => void;
}

export const VideoPlayerContext = createContext<VideoPlayerInterface>({
  isPlaying: false,
  currentTime: 0,
  currentIndex: 0,
  setIsPlaying: () => {},
  setCurrentTime: () => {},
  setCurrentIndex: () => {}
});

const AppVideoPlayerContext = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <VideoPlayerContext.Provider
      value={{
        isPlaying,
        currentTime,
        currentIndex,
        setIsPlaying,
        setCurrentTime,
        setCurrentIndex
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};

export default AppVideoPlayerContext;
