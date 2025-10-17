import Clipboard from '@react-native-clipboard/clipboard';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useContext, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Share, { Social } from 'react-native-share';

export interface ShareAppInteface {
  scheme: string;
  shareUrl: string;
  name: string;
  icon: string;
}

// Share Apps Configuration
const SHARE_APPS: Array<ShareAppInteface> = [
  {
    scheme: '',
    shareUrl: '',
    name: 'Copy Link',
    icon: 'copyLink'
  },
  {
    scheme: 'whatsapp://',
    shareUrl: 'whatsapp://send?text=',
    name: 'WhatsApp',
    icon: 'whatsapp'
  },
  {
    scheme: 'fb-messenger://',
    shareUrl: 'fb-messenger://share/?link=',
    name: 'FB Messenger',
    icon: 'fb'
  },
  {
    scheme: 'tg://',
    shareUrl: 'tg://msg?text=',
    name: 'Telegram',
    icon: 'telegram'
  },
  {
    scheme: 'instagram://',
    shareUrl: 'instagram://create?text=',
    name: 'IG Direct',
    icon: 'instagram'
  },
  {
    scheme: 'line://',
    shareUrl: 'line://msg/text/',
    name: 'LINE',
    icon: 'line'
  },
  {
    scheme: '',
    shareUrl: '',
    name: '',
    icon: ''
  },
  {
    scheme: '',
    shareUrl: '',
    name: '',
    icon: ''
  }
];

const useShare = () => {
  const [shareLink, setShareLink] = useState<string | null>(null);

  const SHARE_MESSAGE = `Check out this gem I found on SriCandy! \n ${shareLink}`;
  const ENCODED_MESSAGE = encodeURIComponent(SHARE_MESSAGE);
  const ShareApp = SHARE_APPS;

  const {
    setIsShowToast,
    setToastMessage: setMessage,
    setType,
    setIcon
  } = useContext(ModalToastContext);

  const [isProcessShareLink, setIsProcessShareLink] = useState<boolean>(false);
  const { setLoading } = useContext(LoadingContext);
  const [isShowModalShare, setIsShowModalShare] = useState<boolean>(false);

  const [isShowToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const isAppInstalled = async (scheme: string) => await Linking.canOpenURL(scheme);

  const handleErrorAppNotInstalled = () => {
    setIsShowModalShare(true);
    setTimeout(() => {
      setShowToast(true);
      setToastMessage('Download the app to enable sharing.');
      setIsError(true);
    }, 500);
  };

  const handleShare = async (app: ShareAppInteface) => {
    setLoading(true);
    setTimeout(async () => {
      let installed;
      if (Platform.OS === 'android' && app.scheme === 'whatsapp://') {
        setLoading(false);
        installed = await Linking.canOpenURL(`${app.scheme}send`);
      } else if (Platform.OS === 'android' && app.scheme === 'twitter://') {
        setLoading(false);
        installed = await Linking.canOpenURL(`${app.scheme}post`);
      } else if (Platform.OS === 'ios' && app.scheme === 'tg://') {
        setLoading(false);
        installed = await Linking.canOpenURL(`https://t.me/${shareLink}`);
      } else {
        setLoading(false);
        installed = await isAppInstalled(app.scheme);
      }

      if (!installed) {
        setLoading(false);
        handleErrorAppNotInstalled();
        return;
      }
      setLoading(false);
      await Linking.openURL(`${app.shareUrl}${app.icon === 'fb' ? shareLink : ENCODED_MESSAGE}`);
    }, 1000);
  };

  const handleShareInstagram = async () => {
    setLoading(true);
    if (Platform.OS === 'ios') {
      const installed = await isAppInstalled('instagram://');
      if (!installed) {
        setLoading(false);
        handleErrorAppNotInstalled();
        return;
      }
      setLoading(false);
      await Linking.openURL(`instagram://sharesheet?text=${decodeURIComponent(ENCODED_MESSAGE)}`);
    } else {
      Share.shareSingle({
        social: Social.Instagram,
        url: decodeURIComponent(ENCODED_MESSAGE),
        type: 'text'
      })
        .then(() => {
          setIsProcessShareLink(false);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          handleErrorAppNotInstalled();
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  };

  const handleNativeShare = () => {
    const shareOptions = {
      title: 'Lorem Ipsum',
      message: 'Simple share with message',
      url: 'https://google.com'
    };
    Share.open(shareOptions)
      .then((res) => {
        // eslint-disable-next-line no-console
        console.log(res);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        err && console.log(err);
      });
    // eslint-disable-next-line no-console
    Share.open(shareOptions).catch(console.error);
  };

  const handleCopyLink = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        Clipboard.setString(shareLink as string);
        setLoading(false);
        setIsShowToast(true);
        setType('success');
        setMessage('Link has been successfully copied.');
        setIcon('checkCircleOutline');
      } catch (error) {
        setLoading(false);
        setIsShowModalShare(true);
        setTimeout(() => {
          setShowToast(true);
          setToastMessage('Failed to copy the link. Check and try again.');
          setIsError(false);
        }, 500);
      }
    }, 1000);
  };

  return {
    ShareApp,
    handleShare,
    handleNativeShare,
    handleShareInstagram,
    handleCopyLink,
    isProcessShareLink,
    setIsProcessShareLink,
    isShowModalShare,
    setIsShowModalShare,
    setShareLink,
    isShowToast,
    setShowToast,
    toastMessage,
    isError,
    setIsError
  };
};

export default useShare;
