import styled, { css } from 'styled-components';
import { colors } from '../../styles';

interface ButtonLocaleProps {
  opened: boolean;
}

export const Container = styled.div<ButtonLocaleProps>`
  position: absolute;
  top: 0;
  left: -80px;
  margin-top: 1rem;
  transition: left 500ms;
  ${props =>
    props.opened &&
    css`
      left: 0px;
    `}
`;

export const ButtonLocaleContainer = styled.div`
  cursor: pointer;
  border: none;
  background-color: ${colors.blueLight};
  border-radius: 0px 26px 26px 0px;
  padding: 0.6rem 0px;
  min-width: 3.5rem;
  transition: min-width 500ms;
  display: flex;
  justify-content: flex-end;
`;

export const ButtonLocale = styled.button`
  margin: 0px 0.5rem;
  border: none;
  background-color: ${colors.blueLight};
`;

export const FlagImage = styled.img``;
