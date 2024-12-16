import styled, { css } from 'styled-components';
import { colors } from '../../styles';

interface ContainerProps {
  loader: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: absolute;
  display: none;
  top: 0px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  z-index: 999999;
  justify-content: center;
  align-items: center;
  ${props =>
    props.loader &&
    css`
      display: flex;
    `}
`;

export const Loader = styled.div`
  display: inline-block;
  border: 4px solid hsl(222 100% 95%);
  border-left-color: ${colors.blue};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: donut-spin 1.2s linear infinite;
  @keyframes donut-spin {
    to {
      transform: rotate(1turn);
    }
  }
`;
