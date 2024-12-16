import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveFontSizeLocal,
  getCurrentProjectLocal,
} from '../services/fontSizeService';

interface ContextFontSize {
  fontSize: number;
  increment(): void;
  decrement(): void;
}

const FontSizeContext = createContext<ContextFontSize>({} as ContextFontSize);

const FontSizeProvider: React.FC = ({ children }) => {
  const [fontSize, setFontSize] = useState<number>(15);
  const increment = (): void => {
    if (fontSize === 21) return;

    const newFontSize = fontSize + 1;
    setFontSize(newFontSize);
    saveFontSizeLocal(newFontSize.toString());
  };
  const decrement = (): void => {
    if (fontSize === 12) return;

    const newFontSize = fontSize - 1;
    setFontSize(newFontSize);
    saveFontSizeLocal(newFontSize.toString());
  };

  useEffect(() => {
    const stringFontSize = getCurrentProjectLocal();
    if (stringFontSize) {
      setFontSize(Number.parseInt(stringFontSize, 10));
    }
  }, []);

  return (
    <FontSizeContext.Provider
      value={{
        increment,
        decrement,
        fontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

function useFontSize(): ContextFontSize {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error('useData must be used within an AuthProvider');
  }

  return context;
}

export { FontSizeProvider, useFontSize };
