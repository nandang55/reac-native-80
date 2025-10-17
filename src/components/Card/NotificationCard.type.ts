import { NotificationInterface } from 'interfaces/NotificationInterface';

export interface NotificationCardInterface extends NotificationInterface {
  onPress: () => void;
}
