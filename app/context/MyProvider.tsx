// /context/MyProvider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface MyContextType {
  isDown: boolean;
  setIsDown: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDown, setIsDown] = useState(false);

  return (
    <MyContext.Provider value={{ isDown, setIsDown }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
