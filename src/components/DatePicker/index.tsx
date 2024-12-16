import React from 'react';
import { registerLocale } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { es, ptBR, enUS } from 'date-fns/locale';
import { useController } from 'react-hook-form';
import { Control } from 'react-hook-form';
import * as S from './styles';

import 'react-datepicker/dist/react-datepicker.css';

interface datePickerProps {
  placeholder: string;
  name: string;
  control?: Control;
  handleOnChange?: (date: Date) => void;
}

const availableLanguages = {
  es: { locale: 'es', dateFNS: es, dateFormat: 'dd/MM/yyyy' },
  pt: { locale: 'pt-BR', dateFNS: ptBR, dateFormat: 'dd/MM/yyyy' },
  en: { locale: 'en-US', dateFNS: enUS, dateFormat: 'MM/dd/yyyy' },
};

type availableLanguagesIndex = keyof typeof availableLanguages;

const getLanguageFromBrowser = (browserLanguage: string) => {
  if (browserLanguage in availableLanguages) {
    return availableLanguages[browserLanguage as availableLanguagesIndex];
  }

  return availableLanguages.en;
};

const DatePicker = (props: datePickerProps) => {
  const { i18n } = useTranslation();
  const { handleOnChange } = props;
  const {
    field: { ref, onChange, onBlur, value },
    meta,
  } = useController({
    name: props.name,
    control: props.control,
    rules: { required: true },
    defaultValue: '',
  });

  const browserLanguage = i18n.language.slice(0, 2); // Handles pt-BR x pt-PT
  const language = getLanguageFromBrowser(browserLanguage);

  registerLocale(language.locale, language.dateFNS);

  return (
    <S.StyledDatePicker
      locale={language.locale}
      selected={value ? new Date(value) : new Date()}
      placeholderText={props.placeholder}
      onChange={(changedDate: Date) => {
        if(handleOnChange)
          handleOnChange(changedDate)
        
        onChange(changedDate);
      }}
      dateFormat={language.dateFormat}
    />
  );
};

export default DatePicker;
