import type {
  VariantActiveState,
  VariantOption,
  Variants
} from 'interfaces/ProductDetailInterface';

export interface VariantOptionsInterface {
  data: Array<VariantOption>;
  label: string;
  active: VariantActiveState;
  sequence: Variants;
  setActive: (value: (prev: VariantActiveState) => VariantActiveState) => void;
  optionFullRounded?: boolean;
  withDisable?: boolean;
}
