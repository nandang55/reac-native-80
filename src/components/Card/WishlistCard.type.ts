import { WishlistInterface } from 'interfaces/WishlistInterface';

export interface WishlistCardInterface {
  data: WishlistInterface;
  edit?: boolean;
  checked: boolean;
  onOpenCart: () => void;
  onRemoveWishlist: () => void;
  onChecked: (produtcId: string) => void;
  onClickProduct: () => void;
}
