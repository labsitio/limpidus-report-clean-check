import styled from 'styled-components';
import { colors } from '../../styles';

export const Input = styled.input`
  border-radius: 4px;
  background: ${colors.white};
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  border: 1px solid ${colors.grayLight};
  margin-bottom: 0.9rem;
  color: ${colors.gray};

  &:focus {
    border-color: ${colors.blue};
  }
  &[type='date']:first-child {
    margin-right: 10px;
  }
`;

export const Combo = styled.select`
  border-radius: 4px;
  background: ${colors.white};
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  border: 1px solid ${colors.grayLight};
  margin-bottom: 0.9rem;
  color: ${colors.gray};

  &:focus {
    border-color: ${colors.blue};
  }
  &[type='date']:first-child {
    margin-right: 10px;
  }
`;
export const Option = styled.option`
  color: ${colors.gray};
`;