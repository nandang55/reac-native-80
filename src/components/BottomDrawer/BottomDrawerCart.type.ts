import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Ref } from 'react';

export interface BottomDrawerCartProps {
  bottomSheetRef: Ref<BottomSheetMethods> | undefined;
  onChange?: ((id: string) => void) | undefined;
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  isSearchable?: boolean;
  onClose: () => void;
  isShowConfirmation?: boolean;
  isLoading?: boolean;
  isMutating?: boolean;
  onFocus?: () => void;
  onPressAddToCart: () => void;
  labelAddToCart: string;
  searchPlaceholder?: string;
  productTitle: string;
  productImage: string;
  price: string;
  stock: number | '-';
  children: React.ReactNode;
}
