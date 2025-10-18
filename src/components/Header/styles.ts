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
  margin: 0 15px;
  border: 1px solid ${colors.white};
  color: ${colors.white};
  border-radius: 5px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  padding: 5px;
  display: flex;
  margin-right: 0;
  font-size: 20px;
`;
export const ButtonExport = styled.button`
  border: 1px solid ${colors.white};
  color: ${colors.white};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background-color: transparent;
  width: 135px;
  margin: 0 15px;
  margin-right: 0;

  svg {
    margin-right: 0.5rem;
  }
`;

export const MenuButtonImage = styled.img``;

export const GroupButton = styled.div`
  width: 250px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const TextExit = styled.p`
  color: ${colors.white};
  margin-left: 0.5rem;
  `