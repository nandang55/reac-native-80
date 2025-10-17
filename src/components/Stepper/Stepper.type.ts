export interface StepperInterface {
  stepCount: number;
  currentPosition: number;
  labels: Array<string>;
  currentFree?: boolean;
  nextFree?: boolean;
  currentDiscount?: number;
  nextDiscount?: number;
  remainingPrice?: number;
}
