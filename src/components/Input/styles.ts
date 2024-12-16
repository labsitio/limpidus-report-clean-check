import styled, { css } from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

interface ContainerProps {
  hasError: boolean;
}

export const Input = styled.input<ContainerProps>`
  border-radius: 4px;
  background: ${colors.white};
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  border: 1px solid ${colors.grayLight};
  margin-bottom: 0.9rem;
  color: ${colors.gray};

  &:focus {
    border-color: ${colors.blue};

    ${props =>
      props.hasError &&
      css`
        border-color: ${colors.red};
      `}
  }

  ${props =>
    props.hasError &&
    css`
      border-color: ${colors.red};
    `}

  ${media.lessThan('medium')`
    margin-bottom: 0rem;
  `}
`;

export const Container = styled.div`
  margin-bottom: 1.5rem;
  ${media.lessThan('medium')`
    margin-bottom: 0.5rem;
  `}
`;

export const Error = styled.span`
  color: ${colors.red};
`;
