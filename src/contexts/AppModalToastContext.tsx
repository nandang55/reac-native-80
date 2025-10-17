import { IconType } from 'components/Icon';
import { ModalToastType } from 'components/Modal/ModalToast.type';
import React, { createContext, useState } from 'react';

interface ModalToastContextInterface {
  isShowToast: boolean;
  type: ModalToastType;
  isUnableProcess: boolean;
  setIsUnableProcess: (value: boolean) => void;
  setType: (value: ModalToastType) => void;
  setIsShowToast: (value: boolean) => void;
  toastMessage: string;
  setToastMessage: (value: string) => void;
  icon: IconType | undefined;
  setIcon: (value: IconType) => void;
}

export const ModalToastContext = createContext<ModalToastContextInterface>({
  isShowToast: false,
  type: 'success',
  isUnableProcess: false,
  setIsUnableProcess: () => undefined,
  setType: () => undefined,
  setIsShowToast: () => undefined,
  toastMessage: '',
  setToastMessage: () => undefined,
  icon: undefined,
  setIcon: () => undefined
});

const AppModalToastContext = ({ children }: { children: React.ReactNode }) => {
  const [isShowToast, setIsShowToast] = useState<boolean>(false);
  const [isUnableProcess, setIsUnableProcess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState('');
  const [type, setType] = useState<ModalToastType>('success');
  const [icon, setIcon] = useState<IconType | undefined>(undefined);

  return (
    <ModalToastContext.Provider
      value={{
        type,
        setType,
        isShowToast,
        setIsShowToast,
        toastMessage,
        setToastMessage,
        isUnableProcess,
        setIsUnableProcess,
        icon,
        setIcon
      }}
    >
      {children}
    </ModalToastContext.Provider>
  );
};

export default AppModalToastContext;
