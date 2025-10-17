import config from 'react-native-config';

const AppWhitelabel = config.APP_WHITELABEL;
export interface ColorsInterface {
  primary: string;
  secondary: string;
  dark: {
    blackSolid: string;
    bermudaGrey: string;
    blackCoral: string;
    gumbo: string;
    solitude: string;
    silver: string;
    softDark: string;
    shadowGray: string;
    darkGray: string;
    charcoal: string;
    color1: string;
    neutral: string;
  };
  red: {
    rubyRed: string;
    americanRed: string;
    fireEngineRed: string;
    deepCarmine: string;
    linenRed: string;
    UERed: string;
    deepPink: string;
    softPink: string;
    mintPink: string;
    flamingoPink: string;
    newPink: string;
    newPink2: string;
    newPink3: string;
    deepRed: string;
  };
  blue: {
    bleuDeFrance: string;
    buttonBlue: string;
    cornFlowerBlue: string;
    darkBlue: string;
    lapisLazuli: string;
    maastrichtBlue: string;
    yaleBlue: string;
    dodgerBlue: string;
  };
  teal: {
    verdigris: string;
    aqua: string;
    turquoise: string;
  };
  light: {
    aliceBlue: string;
    whiteSolid: string;
    whiteSmoke: string;
  };
  yellow: {
    mikadoYellow: string;
    goldenrodYellow: string;
    sunset: string;
    warningYellow: string;
    lightYellow: string;
    darkYellow: string;
  };
  green: {
    islamicGreen: string;
    pantoneGreen: string;
    kellyGreen: string;
    paleGreen: string;
    lightGreen: string;
    persianGreen: string;
    successGreen: string;
    dustGreen: string;
    emeraldGreen: string;
    aqua: string;
  };
}

export default <ColorsInterface>{
  primary: AppWhitelabel === 'SRICANDY' ? '#FBFBFB' : '#81998A',
  secondary: AppWhitelabel === 'SRICANDY' ? '#FF47A1' : '#D2C697',
  dark: {
    blackSolid: '#000000',
    bermudaGrey: '#8EA1AE',
    blackCoral: '#52616B',
    gumbo: '#73828C',
    solitude: '#CBD2D9',
    silver: '#EAEDF0',
    softDark: '#363636',
    shadowGray: '#00005019',
    darkGray: '#1F1F1F',
    charcoal: '#1D1D1D',
    color1: '#7B7B7B',
    neutral: '#595959'
  },
  red: {
    rubyRed: '#95151A',
    americanRed: '#B22634',
    fireEngineRed: '#CC2027',
    deepCarmine: '#EE3B36',
    linenRed: '#FAE9EA',
    UERed: '#BF0404',
    deepPink: '#F475B0',
    softPink: '#FFFAFB',
    mintPink: '#EFA0AF',
    newPink: '#FF83AF',
    newPink2: '#FFF1F8',
    newPink3: '#F20076',
    flamingoPink: '#F24998',
    deepRed: '#E23645'
  },
  blue: {
    bleuDeFrance: '#2F80ED',
    buttonBlue: '#25A9EF',
    cornFlowerBlue: '#1D81B6',
    darkBlue: '#0E3766',
    lapisLazuli: '#1D639F',
    maastrichtBlue: '#06203F',
    yaleBlue: '#144E91',
    dodgerBlue: '#007AFF'
  },
  teal: {
    verdigris: '#47C2B1',
    turquoise: '#5BCEAF'
  },
  light: {
    aliceBlue: '#F0F5F9',
    whiteSolid: '#FFFFFF',
    whiteSmoke: '#F3F3F3'
  },
  yellow: {
    mikadoYellow: '#FFC107',
    goldenrodYellow: '#FFF6D4',
    sunset: '#FF8B0E',
    warningYellow: '#FFF6D5',
    lightYellow: '#D6C792',
    darkYellow: '#AA9C6C'
  },
  green: {
    islamicGreen: '#049421',
    pantoneGreen: '#0CA940',
    kellyGreen: '#62C500',
    paleGreen: '#EDF9E7',
    lightGreen: '#69CB3B',
    persianGreen: '#009688',
    successGreen: '#049412',
    dustGreen: '#5C7063',
    emeraldGreen: '#077D55',
    aqua: '#009688'
  }
};
