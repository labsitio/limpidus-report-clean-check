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

export const Label = styled.label`
  font-size: 0.875rem;
  color: ${colors.gray};
  margin-bottom: 0.2rem;
  display: block;
`;

export const ComboWrapper = styled.div`
  position: relative;
  margin-bottom: 0.9rem;
`;

export const ComboLabel = styled.label`
  position: absolute;
  left: 10px;
  top: -8px;
  background: ${colors.white};
  padding: 0 5px;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.gray};
  pointer-events: none;
  transition: all 0.2s ease;
`;

export const Combo = styled.select`
  border-radius: 4px;
  background: ${colors.white};
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  border: 1px solid ${colors.grayLight};
  color: ${colors.gray};

  &:focus {
    border-color: ${colors.blue};
  }
  &:focus ~ label {
    color: ${colors.blue};
  }
  &:hover {
    cursor: pointer;
  }
  &[type='date']:first-child {
    margin-right: 10px;
  }
`;
export const Option = styled.option`
  color: ${colors.gray};
`;
