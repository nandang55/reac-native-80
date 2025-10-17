import React, { createContext, useState } from 'react';

interface DynamicLinkContextInterface {
  dynamicLinkData: string;
  setDynamicLinkData: React.Dispatch<React.SetStateAction<string>>;
}

export const DynamicLinkContext = createContext<DynamicLinkContextInterface>({
  dynamicLinkData: '',
  setDynamicLinkData: () => undefined
});

const AppDynamicLinkContext = ({ children }: { children: React.ReactNode }) => {
  const [dynamicLinkData, setDynamicLinkData] = useState<string>('');
  return (
    <DynamicLinkContext.Provider value={{ dynamicLinkData, setDynamicLinkData }}>
      {children}
    </DynamicLinkContext.Provider>
  );
};

export default AppDynamicLinkContext;
