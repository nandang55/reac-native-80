export interface NewVersionConfirmationProps {
  isVisible: boolean;
  isMandatory: boolean;
  title: string;
  description: string;
  onPressUpdate: () => void;
  onPressClose: () => void;
}
