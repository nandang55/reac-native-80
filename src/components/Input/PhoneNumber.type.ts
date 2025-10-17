export interface InputPhoneNumberInterface {
  label?: string;
  valueCode?: string | undefined;
  valuePhone?: string | undefined;
  onChangeCode?: (value: string) => void;
  onChangePhone?: (value: string) => void;
  onBlurCode?: () => void;
  onFocusCode?: () => void;
  onBlurPhone?: () => void;
  onFocusPhone?: () => void;
  helperText?: string;
  isError?: boolean | undefined;
  errorText?: string;
  isDisabled?: boolean;
}
