import { CartInterface } from 'interfaces/CartInterface';
import { GestureResponderEvent } from 'react-native';

export interface CartCardBaseInterface extends CartInterface {
  activeOpacity?: number;
  setQuantity?: (data: number) => void;
  isChecked?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  handleChecked?: () => void;
  handleRemove?: (id: string) => void;
}
