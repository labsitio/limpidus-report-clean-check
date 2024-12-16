import styled from 'styled-components';
import { shade } from 'polished';
import { colors } from '../../styles';

export const Container = styled.button`
  background: ${colors.blue};
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: ${colors.white};
  width: 100%;
  font-weight: bold;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, `${colors.blue}`)};
  }
`;
