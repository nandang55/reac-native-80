/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
import { Route } from '@react-navigation/native';
import { AccountContext } from 'contexts/AppAccountContext';
import { navigationRef } from 'navigators/RootStackNavigator';
import { useContext, useEffect, useState } from 'react';
import branch from 'react-native-branch';

import useAuth from './useAuth';
import useGetProfile from './useGetProfile';

const useBranchIO = () => {
  const route: Route<string> | undefined = navigationRef?.current?.getCurrentRoute();
  const { signOut } = useAuth();
  const { dispatch } = useContext(AccountContext);

  const [isDinamycLink, setIsDinamycLink] = useState<boolean>(false);

  const { refetch: refetchDataProfile, isFetching: isFetchingDataProfile } = useGetProfile({
    options: {
      enabled: false,
      onSuccess: (data) => {
        if (!data.error) {
          dispatch({ type: 'SetAccount', payload: data.data });
          if (isDinamycLink) {
            setIsDinamycLink(false);
            if (route?.name === 'Loading' || route?.name === undefined) {
              navigationRef.current?.reset({
                index: 0,
                routes: [
                  {
                    name: 'AccountStack',
                    params: { screen: 'ProfileDetail' }
                  }
                ]
              });
            } else {
              navigationRef.current?.navigate('AccountStack', { screen: 'ProfileDetail' });
            }
          }
        }
      },
      onError: (error) => {
        const res = error.response?.data;
        if (res?.error) {
          signOut();
          if (isDinamycLink) {
            setIsDinamycLink(false);
            if (route?.name === 'Loading' || route?.name === undefined) {
              navigationRef.current?.reset({
                index: 0,
                routes: [
                  {
                    name: 'AuthenticationStack',
                    params: { screen: 'Login' }
                  }
                ]
              });
            } else {
              navigationRef.current?.navigate('AuthenticationStack', { screen: 'Login' });
            }
          }
        }
      }
    }
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const listener = branch.subscribe({
      onOpenStart: ({ uri, cachedInitialEvent }) => {
        // eslint-disable-next-line no-console
        console.log(
          'subscribe onOpenStart, will open ' + uri + ' cachedInitialEvent is ' + cachedInitialEvent
        );
      },
      onOpenComplete: ({ error, params, uri }) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error opening Branch link:', error);
          return;
        }
        // eslint-disable-next-line no-console
        console.log('Branch link opened successfully:', {
          params,
          uri
        });

        if (params?.['+clicked_branch_link']) {
          const deeplink = params?.['$deeplink_path'] as string;
          const title = params?.['$og_title'] as string;
          const productIds = params?.['$product_id'] as string;

          setIsDinamycLink(true);

          const parts = deeplink?.split('/').filter(Boolean);

          if (parts[0] === 'product-detail') {
            if (route?.name === 'Loading' || route?.name === undefined) {
              setTimeout(() => {
                navigationRef.current?.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'ProductStack',
                      params: { screen: 'ProductDetail', params: { id: productIds, title } }
                    }
                  ]
                });
              }, 1500);
            } else {
              setIsDinamycLink(false);
              navigationRef.current?.navigate('ProductStack', {
                screen: 'ProductDetail',
                params: { id: productIds, title }
              });
            }
          }

          if (deeplink === 'changeLanguage') {
            navigationRef.current?.navigate('AccountStack', { screen: 'ChangeLanguage' });
          }

          if (deeplink === 'delete-account') {
            dispatch({ type: 'CloseAccount', payload: true });
            refetchDataProfile();
          }
        }
      }
    });
    return () => {
      listener();
    };
  }, [route]);

  return { isDinamycLink, isFetchingDataProfile };
};

export default useBranchIO;
