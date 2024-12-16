import React, { SelectHTMLAttributes } from 'react';

import * as S from './styles';

interface OptionsIProps {
  title: string;
  value: string | number;
}

interface InputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  errors: any;
  register(): void;
  options: OptionsIProps[];
}

const Select: React.FC<InputProps> = ({
  register,
  errors,
  name,
  options,
  placeholder,
  ...rest
}) => {
  return (
    <S.Container>
      <S.Select hasError={errors[name]} ref={register} name={name} {...rest}>
        <S.Option value="" disabled selected>
          {placeholder}
        </S.Option>
        {options.map(option => (
          <S.Option value={option.value}>{option.title}</S.Option>
        ))}
      </S.Select>

      {errors[name] && <S.Error>{errors[name].message}</S.Error>}
    </S.Container>
  );
};

export default Select;
