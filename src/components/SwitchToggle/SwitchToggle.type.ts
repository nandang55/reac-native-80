import { StyleProp, ViewStyle } from 'react-native';

export interface SwitchToggleInterface {
  switchOn: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  circleStyle?: ViewStyle;
  backgroundColorOn?: string;
  backgroundColorOff?: string;
  backgroundImageOn?: React.ReactElement;
  backgroundImageOff?: React.ReactElement;
  circleColorOff?: string;
  circleColorOn?: string;
  duration?: number;
  buttonStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}
