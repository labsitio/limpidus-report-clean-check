import styled from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

export const FooterLanguageSelect = styled.div`
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.blue};
  color: ${colors.white};
  padding: 0px 10px;

  ${media.lessThan('medium')`
      height: 20vh;
      align-items: flex-start;
      justify-content: center;
  `}
`;

export const Language = styled.div`
  font-size: 0.8rem;
  margin: 10px;
  font-weight: strong;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Languages = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Resize = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.white};
  margin-right: 20px;
`;

export const A = styled.span`
  margin: 0 8px;
  font-weight: bold;
  font-size: 20px;
`;

export const More = styled.button`
  color: ${colors.white};
  font-size: 20px;
  border: none;
  background-color: transparent;
  font-weight: bold;
`;

export const Less = styled(More)`
  font-size: 25px;
`;
