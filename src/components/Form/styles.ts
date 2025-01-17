import styled from 'styled-components';
import { Combo, Input } from '../FormFilter/styles';

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
  margin: 0 auto;
  flex-wrap: wrap;
`;
export const Field = styled(Input)`
  width: 150px;
  height: 55px;
  margin-right: 10px;
`;
export const Select = styled(Combo)`
  width: 150px;
  height: 55px;
  margin-right: 10px;
`;
