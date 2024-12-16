import React, { createContext, useContext, useState } from 'react';

interface ContextLoader {
  loader: boolean;
  toggleLoader(flag: boolean): void;
}

const LoaderContext = createContext<ContextLoader>({} as ContextLoader);

const LoaderProvider: React.FC = ({ children }) => {
  const [loader, setLoader] = useState<boolean>(false);

  const toggleLoader = (flag: boolean): void => {
    setLoader(flag);
  };

  return (
    <LoaderContext.Provider
      value={{
        toggleLoader,
        loader,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

function useLoader(): ContextLoader {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error('useData must be used within an AuthProvider');
  }

  return context;
}

export { LoaderProvider, useLoader };
