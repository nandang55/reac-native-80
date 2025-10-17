import { TextInputProps } from 'react-native';

export interface InputOTPProps extends TextInputProps {
  length: number;
  value: string;
  onOTPChange: (otp: string) => void;
}
