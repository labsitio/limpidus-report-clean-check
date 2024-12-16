import styled, { css } from 'styled-components';
import { colors } from '../../styles';

interface ContainerProps {
  hasError: boolean;
}

export const Select = styled.select<ContainerProps>`
  border-radius: 4px;
  background: ${colors.white};
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  border: 1px solid ${colors.grayLight};
  margin-bottom: 0.9rem;
  color: ${colors.gray};
  -moz-appearance: none;
  -webkit-appearance: none;
  &::-ms-expand {
    display: none;
  }

  &:focus {
    border-color: ${colors.blue};

    ${props =>
      props.hasError &&
      css`
        border-color: ${colors.red};
      `}
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${props =>
    props.hasError &&
    css`
      border-color: ${colors.red};
    `}
`;

export const Option = styled.option``;

export const Container = styled.div`
  margin-bottom: 1.5rem;
`;

export const Error = styled.span`
  color: ${colors.red};
`;
