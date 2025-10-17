export interface ModalCountdownProps {
  countTimer: number;
  isVisible: boolean;
  title: string;
  description: string;
  onCloseModal: () => void;
  onPressRefresh: () => void;
}
