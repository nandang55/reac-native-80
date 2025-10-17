import * as NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

let currentNetwork: boolean | null;

NetInfo.fetch().then((state) => {
  currentNetwork = state.isConnected;
});

const useCheckConnection = () => {
  const [netInfo, setNetInfo] = useState<boolean | null>(currentNetwork || true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return {
    isConnected: netInfo
  };
};

export default useCheckConnection;
