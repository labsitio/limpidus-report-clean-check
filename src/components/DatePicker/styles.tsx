import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { colors } from '../../styles';

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 50px;
  border: 1px solid #c8deec;
  border-radius: 4px;
  margin-bottom: 20px;

  font-size: 16px;
  padding: 16px;

  color: ${colors.gray};
`;
