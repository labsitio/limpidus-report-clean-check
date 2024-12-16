import styled from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

export const Container = styled.div`
  background-color: ${colors.white};
  height: 95vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F0F2F5;

  ${media.lessThan('medium')`
      height: 80vh;
  `}
`;
