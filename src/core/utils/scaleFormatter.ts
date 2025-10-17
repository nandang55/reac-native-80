import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 800;
const DEVICE_WIDTH = width > height ? width : height;
const DEVICE_HEIGHT = width < height ? width : height;

const scaledHorizontal = ({ deviceWidth }: { deviceWidth: number }) => {
  return (deviceWidth * DEVICE_WIDTH) / BASE_WIDTH;
};

const scaledVertical = ({ deviceHeight }: { deviceHeight: number }) => {
  return (deviceHeight * DEVICE_HEIGHT) / BASE_HEIGHT;
};

const scaledFontSize = (size: number) => {
  const fontSize = Math.round((size * DEVICE_HEIGHT) / BASE_HEIGHT);
  return DEVICE_WIDTH < BASE_WIDTH ? fontSize + 1 : fontSize;
};

export { scaledFontSize, scaledHorizontal, scaledVertical };
