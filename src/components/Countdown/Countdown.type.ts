import { FontWeightType } from 'components/Text/Text.type';

export interface CountdownProps {
  initialSeconds: number;
  color?: string;
  fontWeight?: FontWeightType;
  onComplete?: () => void;
}
