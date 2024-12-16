import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './styles';

import FlagBr from '../../assets/brFlag.svg';
import FlagEs from '../../assets/esFlag.svg';
import FlagEn from '../../assets/enFlag.svg';

interface Locale {
  placeholder: string;
  src: string;
  alt: string;
  language: string;
  i18nFormat: string;
}

const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const [locales, setLocales] = useState<Locale[]>([
    {
      placeholder: 'Português (Brasil)',
      src: FlagBr,
      alt: 'Bandeira Brasil',
      language: 'pt',
      i18nFormat: 'pt-BR',
    },
    {
      placeholder: 'English (US)',
      src: FlagEn,
      alt: 'Bandeira EUA',
      language: 'en',
      i18nFormat: 'en-US',
    },
    {
      placeholder: 'Español',
      src: FlagEs,
      alt: 'Bandeira Espanha',
      language: 'es',
      i18nFormat: 'es-ES',
    },
  ]);

  const handleSelectLanguage = async (locale: Locale) => {
    await i18n.changeLanguage(locale.i18nFormat);
    localStorage.setItem('limpidusLanguage', JSON.stringify(locale));
    setLocales([
      ...locales.filter(localItem => localItem.language !== locale.language),
      locale,
    ]);
  };

  const getAvailableBrowserLanguage = () => {
    const browserLanguage = i18n.language.slice(0, 2);
    const availableBrowserLanguage = locales.find(
      locale => locale.language === browserLanguage,
    );
    return availableBrowserLanguage;
  };

  const getStorageLanguage = () => {
    const rawStorageLanguage = localStorage.getItem('limpidusLanguage');
    if (rawStorageLanguage) {
      const storageLanguage = JSON.parse(rawStorageLanguage);
      return storageLanguage;
    }
    return null;
  };

  const fallbackLanguage = {
    src: FlagEn,
    alt: 'Bandeira EUA',
    language: 'en',
    i18nFormat: 'en-US',
  };

  useEffect(() => {
    const storageLanguage = getStorageLanguage();
    const availableBrowserLanguage = getAvailableBrowserLanguage();
    let language;

    if (storageLanguage) {
      language = storageLanguage;
    } else if (availableBrowserLanguage) {
      language = availableBrowserLanguage;
    } else {
      language = fallbackLanguage;
    }
    handleSelectLanguage(language);
  }, []);

  const handleLocale = (locale: Locale) => {
    return (
      <S.ButtonLocale onClick={() => handleSelectLanguage(locale)}>
        <S.FlagImage src={locale.src} alt={locale.alt} />{' '}
      </S.ButtonLocale>
    );
  };

  const [opened, setOpened] = useState<boolean>(false);

  return (
    <S.Container opened={opened}>
      <S.ButtonLocaleContainer onClick={() => setOpened(!opened)}>
        {locales.map(locale => handleLocale(locale))}
      </S.ButtonLocaleContainer>
    </S.Container>
  );
};

export default LanguageSelect;
