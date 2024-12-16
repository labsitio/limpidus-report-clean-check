import React from 'react';
import * as S from './styles';

const BaseScreen: React.FC<any> = ({ children }) => {
  return <S.Container>{children}</S.Container>;
};

export default BaseScreen;
