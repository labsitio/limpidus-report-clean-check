import styled from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';
import Button from '../Button';

export const Container = styled.div`
  height: 87.1vh;

  ${media.lessThan('medium')`
      height: 80vh;
  `}

  overflow: auto;
`;

export const Content = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 1rem 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position:relative;

  ${media.lessThan('medium')`
    width: 90%;
  `}
`;

export const Title = styled.h1`
  color: ${colors.blue};
  font-size: 1.5rem;
  font-weight: 500;
`;

export const MessageItemNotFound = styled.h1`
  color: ${colors.gray};
  font-size: 1.5rem;
  font-weight: 500;
  align-self: center;
`;

export const ButtonFilter = styled(Button)`
    width:50px;
    fontsize: 1.5rem;
`