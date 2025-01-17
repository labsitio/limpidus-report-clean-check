import React from 'react';
import { FC } from 'react';
import { Content, Field, Select } from './styles';

export interface IField {
  type: string;
  onChange: (e: any) => void;
  name: string;
  placeholder: string;
  value: any;
  options?: { value: string; label: string; [key:string]: any }[];
  [key: string]: any;
}

interface IFormProps {
  fields: IField[];
}
const Form: FC<IFormProps> = props => {
  const { fields } = props;

  return (
    <Content>
      {fields &&
        fields.map(
          (
            {
              type,
              onChange,
              name,
              placeholder,
              value,
              options = [],
              ...fieldProps
            },
            index,
          ) => {
            if (type === 'select')
              return (
                <Select
                  key={index}
                  name={name}
                  placeholder={placeholder}
                  value={value}
                  onChange={onChange}
                  {...fieldProps}
                >
                  {options.map(({ value : optValue, label, ...optProps }, optIndex) => (
                    <option
                      key={optIndex}
                      value={optValue}
                      defaultValue={optValue}
                      selected={optValue === value}
                      {...optProps}
                    >
                      {label}
                    </option>
                  ))}
                </Select>
              );
            if (type !== 'select')
              return (
                <Field
                  key={index}
                  type={type}
                  onChange={onChange}
                  name={name}
                  placeholder={placeholder}
                  value={value}
                  {...fieldProps}
                />
              );
          },
        )}
    </Content>
  );
};

export default Form;
