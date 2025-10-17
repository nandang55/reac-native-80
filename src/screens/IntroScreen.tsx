import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Bg from 'assets/images/bg.svg';
import Bg2 from 'assets/images/bg2.svg';
import Logo from 'assets/images/logo.svg';
import { Button } from 'components/Button';
import { ImageStatic } from 'components/Image';
import { LayoutScreen } from 'components/layouts';
import { Text } from 'components/Text';
import { _storeLocalStorageItem } from 'core/utils/localStorage';
import { scaledHorizontal, scaledVertical } from 'core/utils/scaleFormatter';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import colors from 'styles/colors';

interface DataPageInterface {
  render: () => React.ReactNode;
}

type NavigationIntroScreenProps = StackNavigationProp<RootStackParamList>;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1
  },
  pageView: {
    flex: 1,
    height: '100%',
    width: Dimensions.get('window').width,
    backgroundColor: colors.light.whiteSolid
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 90,
    paddingHorizontal: 40
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    height: 56,
    backgroundColor: 'transparent'
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  }
});

const IntroScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const navigation = useNavigation<NavigationIntroScreenProps>();
  const { t } = useTranslation(['intro']);
  const pagerRef = useRef<PagerView>(null);

  const INTRO_DATA: Array<DataPageInterface> = [
    {
      render: () => {
        return (
          <>
            <View style={{ position: 'absolute', width: '100%' }}>
              <Bg width="100%" height={scaledHorizontal({ deviceWidth: 900 })} />
            </View>
            <View style={styles.contentView}>
              <View style={{ display: 'flex', gap: 10 }}>
                <Text
                  label={t('intro:title')}
                  color={colors.light.whiteSolid}
                  variant="ultra-large"
                  textAlign="center"
                />
                <Text
                  label={t('intro:description')}
                  color={colors.light.whiteSolid}
                  variant="small"
                  textAlign="center"
                  style={{ paddingHorizontal: 26 }}
                />
              </View>
              <ImageStatic name="ring" />
            </View>
          </>
        );
      }
    },
    {
      render: () => {
        return (
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                position: 'absolute',
                width: '100%',
                zIndex: 999999,
                top: scaledVertical({ deviceHeight: 120 })
              }}
            >
              <Logo width="100%" />
            </View>
            <View style={{ marginBottom: -65 }}>
              <Bg2 width="100%" height={scaledVertical({ deviceHeight: 650 })} />
            </View>
            <ImageStatic name="necklace" fullWidth />
            <View style={{ paddingHorizontal: 50, paddingTop: 10 }}>
              <Text
                label={t('intro:tagLine')}
                color={colors.secondary}
                variant="ultra-large"
                textAlign="center"
              />
            </View>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 60,
                paddingVertical: 40,
                display: 'flex',
                gap: 16
              }}
            >
              <Button
                label={t('intro:login')}
                variant="background"
                color={colors.secondary}
                onPress={() => navigation.navigate('AuthenticationStack', { screen: 'Login' })}
                borderRadius="88px"
                fontSize="large"
              />
              <Button
                label={t('intro:register')}
                variant="secondary"
                onPress={() => navigation.navigate('AuthenticationStack', { screen: 'Register' })}
                borderRadius="88px"
                fontSize="large"
                textColor={colors.dark.gumbo}
                borderColor={colors.dark.gumbo}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.replace('MainBottomTabNavigator', { screen: 'HomeStack' })
                }
              >
                <Text
                  label={t('intro:shopNow')}
                  color={colors.secondary}
                  textAlign="center"
                  textDecoration="underline"
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      }
    }
  ];

  useEffect(() => {
    const setIntroViewed = async () =>
      await _storeLocalStorageItem({ storageKey: 'IntroViewed', storageValue: 'yes' });

    setIntroViewed();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      const nextPage = (selectedIndex + 1) % INTRO_DATA.length;
      pagerRef.current?.setPage(nextPage);
      setSelectedIndex(nextPage);
    }, 2000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedIndex, INTRO_DATA.length]);

  return (
    <LayoutScreen statusBarColor={colors.primary} isNoPadding bottomSafeAreaColor={colors.primary}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => {
          setSelectedIndex(e.nativeEvent.position);
        }}
        ref={pagerRef}
        scrollEnabled
        useNext
      >
        {INTRO_DATA.map((item, index) => (
          <View key={index} style={styles.pageView}>
            {item.render()}
          </View>
        ))}
      </PagerView>
      <View style={styles.indicatorContainer}>
        {INTRO_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: selectedIndex === index ? colors.secondary : colors.dark.solitude
              }
            ]}
          />
        ))}
      </View>
    </LayoutScreen>
  );
};

export default IntroScreen;
