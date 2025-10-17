export interface ModalAlertProps {
  isVisible: boolean;
  onCloseModal: () => void;
  onPressYes?: () => void;
  title: string;
  description: string;
  singleBtnLabel?: string;
  reverse?: boolean;
  children?: React.ReactNode;
}
