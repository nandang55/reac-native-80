import { Text } from 'components/Text';
import React, { useEffect, useRef, useState } from 'react';
import colors from 'styles/colors';

import { CountdownProps } from './Countdown.type';

export const Countdown: React.FC<CountdownProps> = ({
  initialSeconds,
  color,
  fontWeight,
  onComplete
}) => {
  const [remainingSecondsState, setRemainingSecondsState] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(remainingMinutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
    } else {
      const formattedMinutes = String(remainingMinutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      return `${formattedMinutes} : ${formattedSeconds}`;
    }
  };

  useEffect(() => {
    if (remainingSecondsState >= 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSecondsState((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    } else {
      onComplete && onComplete();
      return () => {};
    }
  }, [remainingSecondsState, onComplete]);

  return (
    <Text
      label={formatTime(remainingSecondsState)}
      fontWeight={fontWeight || 'semi-bold'}
      variant="small"
      color={color || colors.dark.gumbo}
      textAlign="center"
    />
  );
};
