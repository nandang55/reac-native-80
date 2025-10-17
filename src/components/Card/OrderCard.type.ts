import { OrderListInterface } from 'interfaces/OrderInterface';

export interface OrderCardBaseInterface extends OrderListInterface {
  onPressCard?: (id: string) => void;
}
