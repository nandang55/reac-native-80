import { IconType } from 'components/Icon';

export type ModalToastType = 'success' | 'error';
export interface ModalToastProps {
  isVisible: boolean;
  message: string;
  type: ModalToastType;
  onCloseModal: () => void;
  isKeepOpen?: boolean;
  marginTop?: string;
  icon?: IconType;
}
