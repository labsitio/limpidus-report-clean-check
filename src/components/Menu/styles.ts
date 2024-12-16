import styled, { css } from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

interface ContainerProps {
  opened: boolean;
  ref: any;
}

export const Container = styled.div<ContainerProps>`
  top: 0px;
  width: 0px;
  right: 0px;
  position: absolute;
  height: 100vh;
  background-color: ${colors.white};
  box-shadow: -2px 0px 20px rgba(0, 0, 0, 0.15);
  transition: 0.3s;
  display: flex;
  height: 100%;
  transition: 200ms;
  flex-direction: column;
  ${props =>
    props.opened &&
    css`
      width: 450px;
      ${media.lessThan('small')`
        width: 100%;
      `};
    `}
  z-index: 999;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1;
`;

export const Title = styled.span`
  color: ${colors.blue};
  font-size: 1.5rem;
  align-self: center;
  margin-bottom: 3rem;
`;

export const ButtonIcon = styled.button`
  border: none;
  width: 40px;
  height: 40px;
  background-color: ${colors.white};
`;

export const IconClose = styled.img`
  color: ${colors.blue};
`;

export const Form = styled.form`
  padding: 0px 1rem;
`;

interface RowProps {
  flexColumn?: boolean;
  justifySpaceBetween?: boolean;
}

export const Row = styled.div<RowProps>`
  display: flex;
  ${props =>
    props.flexColumn &&
    css`
      flex-direction: column;
      align-items: stretch;
    `}

  ${props =>
    props.justifySpaceBetween &&
    css`
      justify-content: space-between;
    `}
`;

export const Buttons = styled.div`
  align-self: flex-end;
  width: 100%;
`;

export const Button = styled.button`
  width: 100%;
  color: ${colors.white};
  background-color: ${colors.blue};
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  height: 4rem;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ButtonExit = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.blue};
  font-weight: normal;
`;

export const IconExit = styled.img`
  margin-right: 5px;
`;
