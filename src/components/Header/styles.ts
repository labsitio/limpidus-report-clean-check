import styled from 'styled-components';
import { colors } from '../../styles';

export const Container = styled.div`
  background-color: ${colors.blue};
  display: flex;
  height: 5rem;
  padding: 0.8rem 0px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px 1rem;
`;

export const Logo = styled.img``;

export const MenuButton = styled.button`
  border: none;
  background-color: transparent;
`;
export const ButtonExport = styled.button`
  border: 1px solid ${colors.white};
  color: ${colors.white};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: transparent;
  width: 135px;

  svg {
    margin-right: 0.5rem;
  }
`;

export const MenuButtonImage = styled.img``;

export const GroupButton = styled.div`
  width: 180px;
  display: flex;
  justify-content: space-around;
`;

export const TextExit = styled.p`
  color: ${colors.white};
  margin-left: 0.5rem;
  `