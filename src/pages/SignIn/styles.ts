import styled from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

export const Container = styled.div`
  width: 80vw;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${media.lessThan('medium')`
    flex-direction: column;
    align-items: center;
  `}
`;

export const LogoContainer = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 1rem;
`;

export const Logo = styled.img`
  width: 300px;

  ${media.lessThan('medium')`
    width: 150px;
  `}
`;

export const Card = styled.div`
  background-color: ${colors.white};
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 2rem;
  width: 500px;

  ${media.lessThan('medium')`
    width: 300px;
  `}
`;

export const Title = styled.span`
  text-align: center;
  margin-bottom: 1.5rem;

  ${media.lessThan('medium')`
    margin-bottom: 0.5rem;
  `}
`;

export const Subtitle = styled(Title)`
  color: ${colors.orange};
  ${media.lessThan('medium')`
    margin-bottom: 0.5rem;
  `}
`;

export const Form = styled.form``;
