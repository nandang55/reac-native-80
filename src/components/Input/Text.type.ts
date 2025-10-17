import { IconType } from 'components/Icon';
import {
  InputModeOptions,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';

export interface TextInputInterface {
  label?: string;
  value: string | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  isError?: boolean | undefined;
  errorText?: string;
  suffix?: string;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions | undefined;
  inputMode?: InputModeOptions;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  rightIcon?: IconType;
  rightIconPress?: () => void;
  center?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  onClear?: () => void;
}
