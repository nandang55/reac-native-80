import React, { createContext, useState } from 'react';

interface LoadingContextInterface {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = createContext<LoadingContextInterface>({
  loading: false,
  setLoading: () => undefined
});

const AppLoadingContext = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>
  );
};

export default AppLoadingContext;
