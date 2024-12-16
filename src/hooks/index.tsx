import React from 'react';

import { DataProvider } from './data';
import { LoaderProvider } from './loader';
import { FontSizeProvider } from './fontSize';

const AppProvider: React.FC = ({ children }) => {
  return (
    <LoaderProvider>
      <FontSizeProvider>
        <DataProvider>{children}</DataProvider>
      </FontSizeProvider>
    </LoaderProvider>
  );
};

export default AppProvider;
