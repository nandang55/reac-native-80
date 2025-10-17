export type ImageStaticType = 'ring' | 'necklace' | 'paypal';

export interface ImageStaticProps {
  name: ImageStaticType;
  size?: number;
  fullWidth?: boolean;
}
