
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LogoContextType {
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: React.ReactNode }) {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // Load saved logo from localStorage on init
  useEffect(() => {
    const savedLogo = localStorage.getItem('customLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  // Save to localStorage when logo changes
  useEffect(() => {
    if (customLogo) {
      localStorage.setItem('customLogo', customLogo);
    } else {
      localStorage.removeItem('customLogo');
    }
  }, [customLogo]);

  return (
    <LogoContext.Provider value={{ customLogo, setCustomLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};
