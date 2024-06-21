'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

interface ContextProps {
  countryCode: string;
  setCountryCode: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
  countryCode: 'US',
  setCountryCode: (): string => ''
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [countryCode, setCountryCode] = useState('');
  return (
    <GlobalContext.Provider value={{ countryCode, setCountryCode }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
