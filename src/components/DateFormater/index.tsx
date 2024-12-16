import React from 'react';
import * as S from './styles';
import { useTranslation } from 'react-i18next';

interface date {
  day: string;
  month: string;
  year: string;
}

const DateFormater = (props: date) => {
  const { t, i18n } = useTranslation();

  const getAmericanDate = () => {
    return <S.Data>{`${props.month}/${props.day}/${props.year}`}</S.Data>;
  };

  const getLatinDate = () => {
    return <S.Data>{`${props.day}/${props.month}/${props.year}`}</S.Data>;
  };

  if (i18n.language === 'en-US') {
    return getAmericanDate();
  }

  return getLatinDate();
};

export default DateFormater;
