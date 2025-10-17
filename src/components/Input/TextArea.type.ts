import { TextStyleProps } from 'components/Text/Text.type';
import { AddressSuggestionInterface } from 'interfaces/AddressInterface';
import { KeyboardTypeOptions, ViewStyle } from 'react-native';

export interface TextAreaInputInterface {
  label?: string;
  value: string | undefined;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
  isError?: boolean | undefined;
  errorText?: string;
  suffix?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  numberOfLines: number;
  maxLength?: number;
  borderStyle?: ViewStyle;
  isNotTextArea?: boolean;
  showSuggestions?: boolean;
  suggestionData?: Array<AddressSuggestionInterface>;
  suggestionOnPress?: (value: string) => void;
  isRequired?: boolean;
  labelStyle?: TextStyleProps;
  helperTextStyle?: TextStyleProps;
}
