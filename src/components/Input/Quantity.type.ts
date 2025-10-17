export interface InputQuantityInterface {
  value: number;
  setValue: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}
