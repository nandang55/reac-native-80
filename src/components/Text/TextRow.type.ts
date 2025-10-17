import { TextStyleProps } from './Text.type';

export interface TextRowProps {
  label: string;
  value: string;
  labelProps?: TextStyleProps;
  valueProps?: TextStyleProps;
}
