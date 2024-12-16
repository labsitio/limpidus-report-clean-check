import styled from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

export const Container = styled.div`
  height: 95vh;

  ${media.lessThan('medium')`
      height: 80vh;
  `}

  overflow: auto;
`;

export const Content = styled.div`
  margin: 0 auto;
  width: 70%;
  padding: 1rem 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${media.lessThan('medium')`
    width: 90%;
  `}
`;

export const Title = styled.h1`
  color: ${colors.blue};
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 3rem;
`;

export const MessageItemNotFound = styled.h1`
  color: ${colors.gray};
  font-size: 1.5rem;
  font-weight: 500;
  align-self: center;
`;
