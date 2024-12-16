import React, { InputHTMLAttributes } from 'react';

import * as S from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  errors: any;
  register(): void;
}

const Input: React.FC<InputProps> = ({ register, errors, name, ...rest }) => {
  return (
    <S.Container>
      <S.Input
        hasError={errors[name]}
        ref={register}
        name={name}
        type="text"
        {...rest}
      />
      {errors[name] && <S.Error>{errors[name].message}</S.Error>}
    </S.Container>
  );
};

export default Input;
