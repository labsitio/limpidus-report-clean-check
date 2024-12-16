import styled from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

export const HeadersWapper = styled.div`
  display: flex;
  ${media.lessThan('medium')`
    margin-top: 1.5rem;
  `}
  justify-content: flex-end;
`;

export const Header = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${colors.black};
  font-size: 1.15rem;
  ${media.lessThan('medium')`
    width: 50px;
    font-size: 0.9rem;
    font-weight: 600;
  `}
`;

export const GhostArrowAligner = styled.div`
  width: 0.625rem;
  margin-right: 1rem;

  ${media.lessThan('medium')`
    margin-right: 0.5rem;
  `}
`;
