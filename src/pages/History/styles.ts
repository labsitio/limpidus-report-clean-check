import styled from 'styled-components';
import { colors } from '../../styles';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody`
  /* height: 400px; */
  overflow-y: auto;
`;

export const TableRow = styled.tr`
  border: 0;
`;

export const TableHeader = styled.th`
  color: ${colors.black};
`;

export const TableCell = styled.td`
  text-align: center;
  border: 1px solid ${colors.grayLighter};
  padding: 0.5rem 0.3rem;
  flex-wrap: wrap;

  &:first-child {
    text-align: left;
  }
`;
export const TouchableHeader = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

export const ExtenseHour = styled.div`
  color: ${colors.blue};
  font-weight: 600;
  margin-left: 8px;
`;
export const DateSessionFormater = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
