import { IconProps } from 'components/Icon';
import { StyleProp, ViewStyle } from 'react-native';

export interface BadgeComponentProps extends IconProps {
  onPress?: () => void;
  isSuccess?: boolean;
  total: number;
  style?: StyleProp<ViewStyle>;
  countStyle?: StyleProp<ViewStyle>;
}
