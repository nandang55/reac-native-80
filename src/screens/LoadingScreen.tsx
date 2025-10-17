import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LogoVerticallGradientPink from 'assets/images/Logo/vertical-logo-gradient-pink.svg';
import { Text } from 'components/Text';
import config from 'config';
import { _retrieveLocalStorageItem } from 'core/utils/localStorage';
import { scaledVertical } from 'core/utils/scaleFormatter';
import useBranchIO from 'hooks/useBranchIO';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useEffect } from 'react';
import { ImageBackground, StatusBar, Text as TextReactNative, View } from 'react-native';
import colors from 'styles/colors';

type RootStackScreenProps = StackNavigationProp<RootStackParamList, 'Loading'>;

const LoadingScreen = () => {
  const { isDinamycLink, isFetchingDataProfile } = useBranchIO();
  const navigation = useNavigation<RootStackScreenProps>();
  const AppWhitelabel = config.appWhitelabel;

  useEffect(() => {
    const retrieveIntroViewed = async () => await _retrieveLocalStorageItem('IntroViewed');

    const handleDynamicLink = async () => {
      if (isDinamycLink || isFetchingDataProfile) {
        return;
      }

      const introViewed = await retrieveIntroViewed();
      if (introViewed === 'yes') {
        navigation.replace('MainBottomTabNavigator', { screen: 'HomeStack' });
      } else {
        navigation.replace('AuthenticationStack', { screen: 'Login' });
      }
    };

    const timeoutLoading = setTimeout(handleDynamicLink, 1500);

    return () => clearTimeout(timeoutLoading);
  }, [navigation, isDinamycLink, isFetchingDataProfile]);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle={'light-content'} />
      <ImageBackground
        source={require('../assets/images/bg-radialGradient.png')}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: scaledVertical({ deviceHeight: -160 }),
            gap: 8
          }}
        >
          <View style={{ marginLeft: -25 }}>
            <LogoVerticallGradientPink width="256px" height="256px" />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              label="Stay Sweet,"
              fontWeight="heading"
              variant="collosal"
              color={colors.light.whiteSolid}
            />
            <Text
              label="Stay Pretty,"
              fontWeight="heading"
              variant="collosal"
              color={colors.light.whiteSolid}
            />
            <TextReactNative>
              <Text
                label="Everyday"
                fontWeight="heading"
                variant="collosal"
                color={colors.secondary}
              />
              <Text
                label="."
                fontWeight="heading"
                variant="collosal"
                color={colors.light.whiteSolid}
              />
            </TextReactNative>
          </View>
        </View>
      </ImageBackground>

      <View style={{ bottom: 16, position: 'absolute', justifyContent: 'center', width: '100%' }}>
        <Text
          color={colors.light.whiteSolid}
          label={`© ${AppWhitelabel === 'SRICANDY' ? 'SriCandy' : 'Sparkle'} v${
            config.appVersion
          }, ${new Date().getFullYear()}`}
          textAlign="center"
        />
      </View>
    </>
  );
};

export default LoadingScreen;
