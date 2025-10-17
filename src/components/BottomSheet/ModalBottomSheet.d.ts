import { IconType } from 'components/Icon';
import React from 'react';
import { KeyboardTypeOptions } from 'react-native';
type BottomSheetType = 'input' | 'normal';

export type TModalBottomSheetProps = TModalBottomSheetInputProps & {
  label?: string;
  type: BottomSheetType;
  isVisible: boolean;
  onCloseModal: () => void;
  render?: React.ReactNode;
  footerRender?: React.ReactNode;
  isShowButtonAction?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isShowToast?: boolean;
  onClosedToast?: () => void;
  messageToast?: string;
  typeToast?: 'error' | 'success';
  iconToast?: IconType;
};

export type TModalBottomSheetInputProps = {
  value?: string | undefined;
  onChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  isError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions | undefined;
  rightIcon?: IconType;
  center?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  onClear?: () => void;
  isAutofocus?: boolean;
};
