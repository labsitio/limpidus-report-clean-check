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
  height: 580px;
  background-color: ${colors.white};
  box-shadow: -2px 0px 20px rgba(0, 0, 0, 0.15);
  transition: 0.3s;
  display: flex;
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

  &.desktop {
    position: relative;
    width: 100%;
    height: auto;
    box-shadow: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 1rem;
  margin-bottom: 10px;
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
`;

export const ButtonIcon = styled.button`
  border: none;
  width: 40px;
  height: 40px;
  background-color: ${colors.white};
  color: ${colors.blue};
  border-radius: 5px;
  border: 1px solid ${colors.blue};
  font-size: 1.5rem;
  display: flex;
  align-self: center;

  svg {
    margin: 0 auto;
    align-self: center;
  }
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
  border: 1px solid ${colors.white};
  color: ${colors.blue};
  font-weight: normal;
  margin: 0 15px;
  margin-right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  align-self: center;
  height: auto !important;
  padding: 5px;

  &.desktop {
    color: ${colors.white};
    background-color: ${colors.blue};
    width: auto;
    display: flex;
    justify-content: center;
    align-self: center;
    align-items: center;
    &svg {
      display: none;
      margin-right: 5px;
    }
  }
`;

export const IconExit = styled.img`
  margin-right: 5px;
  &.desktop {
    color: ${colors.white};
  }
`;
