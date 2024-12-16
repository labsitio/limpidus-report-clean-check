import styled, { css } from 'styled-components';
import { colors } from '../../styles';
import media from 'styled-media-query';

export const ListTasks = styled.div`
  width: 100%;
  border-top: 0.3px ${colors.blue} solid;
`;

export const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f0f9fd;
  &:nth-child(2n) {
    background-color: ${colors.white};
  }
  padding: 0.6rem;

  ${media.lessThan('small')`
    padding: 0.3rem;
  `}
  width: 100%;
`;

export const TaskHeaderTitle = styled.span`
  font-weight: 500;
  color: ${colors.black};
  font-size: 1rem;
`;

export const TaskTitle = styled(TaskHeaderTitle)`
  font-weight: normal;
  font-size: 0.8rem;

  ${media.lessThan('small')`
    font-size: 0.6rem;
  `}
`;
