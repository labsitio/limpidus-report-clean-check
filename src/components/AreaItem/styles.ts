import styled, { css } from 'styled-components';
import media from 'styled-media-query';
import { colors } from '../../styles';

export const AreaCollapseWrapper = styled.div`
  padding: 0rem 0rem;
  width: 100%;
  box-shadow: 0px 0px 1.5px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  .ReactCollapse--collapse {
    transition: height 400ms;
  }
  ${media.lessThan('medium')`
    margin-top: 0.6rem;
    padding: 0rem 0.5rem;
  `}
`;
export const AreaItem = styled.div`
  display: flex;
  width: 100%;
`;

export const Title = styled.span`
  font-weight: 600;
  padding: 1rem 0rem 1rem 5px;
  font-size: 1rem;
  color: ${colors.black};
  flex-wrap: wrap;
  white-space: wrap;
  width: 300px;

  ${media.lessThan('large')`
    font-size: 0.9rem;
    padding: 0rem 0rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `};
`;

export const AlignedToHeaders = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
`;

export const EmployeeName = styled.span`
  white-space: wrap;
`;

interface ItemProps {
  inline?: boolean;
  containerMax?: boolean;
}

export const Item = styled.div<ItemProps>`
  flex: 1;
  padding: 0px 0.3rem;
  border-left: 1px solid ${colors.grayLighter};
  display: flex;
  flex-direction: ${props => (props.inline ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
  position: relative;
  ${media.lessThan('medium')`
    width: 50px;
  `}
  ${props =>
    props.containerMax &&
    css`
      flex: 1.5;
    `}
`;

export const ItemContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ExtenseHour = styled.div`
  color: ${colors.gray};
  font-weight: 600;
  margin-left: 8px;
`;

export const StatusArrowWrapper = styled.div`
  display: flex;
`;
export const StatusWrapper = styled.div`
  width: 100px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.gray};
  font-weight: 600;

  ${media.lessThan('medium')`
    width: 50px;
  `}
`;

export const Duration = styled.div``;
interface ButtonArrowProps {
  isOpened: boolean;
}

export const ArrowWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

export const HeaderName = styled.div`
  display: flex;
  justify-content: center;
  color: ${colors.black};
  font-size: 1.15rem;
  position: absolute;
  top: -2rem;
  ${media.lessThan('medium')`
    width: 50px;
    font-size: 0.9rem;
    font-weight: 600;
  `}
`;

export const SortableHeaderName = styled(HeaderName)`
  text-decoration: underline;
  cursor: pointer;
`

export const ButtonArrow = styled.button<ButtonArrowProps>`
  border: none;
  transition: transform 300ms;
  transform: rotate(-180deg);
  background-color: transparent;
  ${props =>
    props.isOpened &&
    css`
      transform: rotate(0deg);
    `}
`;

export const Arrow = styled.img`
  width: 0.625rem;
`;
