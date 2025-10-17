import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import LogoCardEmpty from 'assets/images/card-empty.svg';
import { LayoutScreen } from 'components/layouts';
import { Text } from 'components/Text';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { PaypalContext } from 'contexts/AppPaypalContext';
import { _retrieveLocalStorageItem } from 'core/utils/localStorage';
import { usePostCaptureOrder } from 'hooks/paypal/usePostCaptureOrder';
import { usePostFailedPaypalOrder } from 'hooks/paypal/usePostFailedPaypalOrder';
import useGetOrderDetail from 'hooks/useGetOrderDetail';
import { usePostCompletePaypalOrder } from 'hooks/usePostCompleteOrder';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

const Container = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  justify-content: center;
  padding: 24px 50px;
`;

type PaypalScreenRouteProps = RouteProp<RootStackParamList, 'Paypal'>;
type PaypalScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const PaypalScreen = () => {
  const route = useRoute<PaypalScreenRouteProps>();
  const navigation = useNavigation<PaypalScreenNavigationProps>();
  const { orderId } = useContext(PaypalContext);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const queryClient = useQueryClient();

  const failed = (message: string) => {
    setIsShowToast(true);
    setType('error');
    setToastMessage(message);
    navigation.replace('OrderStack', {
      screen: 'OrderDetail',
      params: { id: route.params.id, source: 'webview' }
    });
  };

  const success = (message: string) => {
    setIsShowToast(true);
    setType('success');
    setToastMessage(message);
    navigation.replace('OrderStack', {
      screen: 'OrderDetail',
      params: { id: route.params.id, source: 'webview' }
    });
  };

  const clearCache = () => {
    queryClient.invalidateQueries(['useGetOrderDetail']);
    queryClient.invalidateQueries(['useGetCartList']);
    queryClient.invalidateQueries(['useGetCountCart']);
    queryClient.invalidateQueries(['useGetOrderList']);
    queryClient.invalidateQueries(['useGetNotificationCount']);
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.multiRemove(['PaypalToken', 'PaypalRequestID', 'PaypalURL']);
      return;
    } catch (error) {
      return error;
    }
  };

  const { data: orderDetail } = useGetOrderDetail({
    id: route.params.id,
    options: { enabled: !!route.params.id }
  });

  const { mutate: captureOrder, isSuccess: successCaptureOrder } = usePostCaptureOrder({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,
    onSuccess: async (data: any) => {
      const token = await _retrieveLocalStorageItem('PaypalToken');
      await completeOrder({ id: route.params.id, paypalResponse: data, token });
    },
    onError: async (error) => {
      const token = await _retrieveLocalStorageItem('PaypalToken');
      await failedOrder({ id: route.params.id, paypalResponse: error.response?.data, token });
    }
  });

  const { mutateAsync: failedOrder, isSuccess: successFailedOrder } = usePostFailedPaypalOrder({
    onSuccess: () => {
      failed('Your payment has been failed.');

      clearCache();
    },
    onError: () => {
      failed('There is something wrong.');
    },
    onSettled: async () => await clearStorage()
  });

  const { mutateAsync: completeOrder, isSuccess: successCompleteOrder } =
    usePostCompletePaypalOrder({
      onSuccess: () => {
        success('Your payment has been successfully processed.');

        clearCache();
      },
      onError: () => {
        failed('Your payment has been failed.');
      },
      onSettled: async () => await clearStorage()
    });

  const isPassed = orderDetail?.data.status === 0;
  const isExpired = orderDetail?.data.status === -100;

  useEffect(() => {
    if (!orderId || successCaptureOrder || successFailedOrder || successCompleteOrder) return;

    if (isExpired) {
      failed('Your order has been expired.');
      return;
    }

    if (isPassed) {
      captureOrder({
        orderId,
        failed: orderDetail.data.payment_info.payment_type === 'PAYPAL_FAILED'
      });
      return;
    }

    failed('Your payment has been failed.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail, orderId]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        const actionType = e.data.action.type;

        if (actionType === 'GO_BACK') {
          e.preventDefault();
        } else {
          navigation.dispatch(e.data.action);
        }
      }),
    [navigation]
  );

  return (
    <LayoutScreen isNoPadding>
      <Container>
        <LogoCardEmpty width="100%" />
        <View style={{ gap: 10, marginTop: 16 }}>
          <Text
            label={'You are almost done!'}
            color={colors.dark.blackCoral}
            textAlign="center"
            variant="large"
          />
          <Text
            label={'We are still processing your payment.'}
            color={colors.dark.bermudaGrey}
            textAlign="center"
            variant="small"
          />
        </View>
      </Container>
    </LayoutScreen>
  );
};

export default PaypalScreen;
