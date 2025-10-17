import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { Ref } from 'react';

export interface BottomDrawerContaninerProps {
  bottomSheetRef: Ref<BottomSheetMethods> | undefined;
  onChange: (index: number) => void;
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  footerComponent?: React.ReactNode;
  title: string;
  onClose: () => void;
  onFocus?: () => void;
  children: React.ReactNode;
}
