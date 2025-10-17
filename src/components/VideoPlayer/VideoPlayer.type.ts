import { OnProgressData } from 'react-native-video';

export interface VideoPlayerProps {
  data: { url: string; thumbnail: string };
  muted: boolean;
  setMuted: (value: boolean) => void;
  initialShowThumbnail?: boolean;
  initialTime?: number;
  isFocused: boolean;
  onPressVideo?: () => void;
  onProgress?: (dataOnProgress: OnProgressData) => void;
  onEnd?: () => void;
}
