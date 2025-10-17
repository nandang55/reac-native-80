import { IconProps, IconType } from 'components/Icon';

export interface MenuListInterface {
  type: 'primary' | 'secondary';
  icon?: IconType;
  iconProps?: Partial<IconProps>;
  rightIcon?: IconType;
  rightIconProps?: Partial<IconProps>;
  iconCard?: boolean;
  iconCardBackground?: string;
  label: string;
  description?: string;
  onPress: () => void;
  selected?: boolean;
  noBorder?: boolean;
}
