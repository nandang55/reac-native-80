export interface ModalNativeAlertProps {
  isVisible: boolean;
  onCloseModal: () => void;
  title: string;
  description: string;
  confirmButton: string;
}
