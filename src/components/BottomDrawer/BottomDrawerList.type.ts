import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { FunctionComponent, Ref } from 'react';

export interface BottomDrawerListInterface {
  id: string;
  value: string;
}

export interface BottomDrawerProps {
  bottomSheetRef: Ref<BottomSheetMethods> | undefined;
  snapPoints: Array<string | number>;
  snapPointsKeyboard: Array<string | number>;
  onChange?: ((id: string) => void) | undefined;
  handleComponent?: FunctionComponent<BottomSheetHandleProps> | undefined;
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  isSearchable?: boolean;
  data: Array<BottomDrawerListInterface>;
  title: string;
  onClose: () => void;
  isShowConfirmation?: boolean;
  onFocus?: () => void;
  selectedId: string;
  searchPlaceholder?: string;
}
