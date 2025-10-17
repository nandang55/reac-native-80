// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PaypalContext } from 'contexts/AppPaypalContext';
import { usePostCreateOrder } from 'hooks/paypal/usePostCreateOrder';
import { PaypalItemsInterface } from 'interfaces/PaypalInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import { useContext } from 'react';
import config from 'react-native-config';

interface PaypalInterface {
  id: string;
  paypal_access_token: string;
  order_payment_id: string;
  paypal_url: string;
  items: Array<PaypalItemsInterface>;
  amount: number;
  item_total_amount: number;
  shipping_cost: number;
  shipping_discount: number;
  insurance: number;
  discount: number;
}

type PaypalNavigationProps = StackNavigationProp<RootStackParamList>;

export const usePaypal = () => {
  const navigation = useNavigation<PaypalNavigationProps>();
  const { setOrderId } = useContext(PaypalContext);

  const { mutateAsync, isLoading } = usePostCreateOrder({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, payload: any) => {
      setOrderId(data.id);
      const uri = data.links.find((link: { rel: string }) => link.rel === 'payer-action').href;
      const return_url = payload.payment_source.paypal.experience_context.return_url;
      const cancel_url = payload.payment_source.paypal.experience_context.cancel_url;

      navigation.navigate('WebView', {
        uri,
        return_url,
        cancel_url
      });
    },
    // eslint-disable-next-line no-console
    onError: (error) => console.log('Error creating order:', error.response)
  });

  const payWithPaypal = async ({
    id,
    paypal_access_token,
    order_payment_id,
    paypal_url,
    items,
    amount,
    insurance,
    item_total_amount,
    shipping_cost,
    shipping_discount,
    discount
  }: PaypalInterface) => {
    const return_url = `${config.DEEPLINK_PREFIX}://paypal-success/${id}/webview`;
    const cancel_url = `${config.DEEPLINK_PREFIX}://OrderDetail/${id}/webview`;

    await AsyncStorage.multiSet([
      ['PaypalToken', paypal_access_token],
      ['PaypalRequestID', order_payment_id],
      ['PaypalURL', paypal_url]
    ]);

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: id,
          amount: {
            currency_code: 'SGD',
            value: amount,
            breakdown: {
              item_total: { currency_code: 'SGD', value: item_total_amount },
              shipping: { currency_code: 'SGD', value: shipping_cost },
              shipping_discount: { currency_code: 'SGD', value: shipping_discount },
              insurance: { currency_code: 'SGD', value: insurance },
              discount: { currency_code: 'SGD', value: discount }
            }
          },
          items: items
        }
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'Sricandy',
            locale: 'en-SG',
            landing_page: 'NO_PREFERENCE',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: return_url,
            cancel_url: cancel_url
          }
        }
      }
    };

    await mutateAsync(payload);
  };

  return {
    payWithPaypal,
    isLoading
  };
};
