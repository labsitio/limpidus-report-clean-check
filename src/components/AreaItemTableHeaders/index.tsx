import React from 'react';
import * as S from './styles';
import Translator from '../Translator';

const AreaItemTableHeaders = () => {
  return (
    <S.HeadersWapper>
      <S.Header>
        <Translator path="dashboard.employee" />
      </S.Header>

      <S.Header>
        <Translator path="dashboard.start" />
      </S.Header>

      <S.Header>
        <Translator path="dashboard.conclusion" />
      </S.Header>

      <S.Header>
        <Translator path="dashboard.duration" />
      </S.Header>

      <S.Header>
        <Translator path="dashboard.status" />
      </S.Header>

      {/* <S.GhostArrowAligner /> */}
    </S.HeadersWapper>
  );
};

export default AreaItemTableHeaders;
