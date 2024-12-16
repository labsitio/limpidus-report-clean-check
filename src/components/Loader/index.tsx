import React from 'react';
import * as S from './styles';
import { useLoader } from '../../hooks/loader';

const Loader: React.FC = () => {
  const { loader } = useLoader();

  return (
    <S.Container loader={loader}>
      <S.Loader />
    </S.Container>
  );
};

export default Loader;
