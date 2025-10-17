import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface IAppCartContext {
  isNewCart: boolean;
  isNavigateFromCart: boolean;
  setIsNewCart: Dispatch<SetStateAction<boolean>>;
  setIsNavigateFromCart: Dispatch<SetStateAction<boolean>>;
}

export const CartContext = createContext<IAppCartContext>({
  isNewCart: false,
  isNavigateFromCart: false,
  setIsNewCart: () => undefined,
  setIsNavigateFromCart: () => undefined
});

const AppCartContext = ({ children }: { children: ReactNode }) => {
  const [isNewCart, setIsNewCart] = useState<boolean>(false);
  const [isNavigateFromCart, setIsNavigateFromCart] = useState<boolean>(false);

  return (
    <CartContext.Provider
      value={{ isNewCart, isNavigateFromCart, setIsNewCart, setIsNavigateFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default AppCartContext;
