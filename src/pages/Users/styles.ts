import styled from 'styled-components';
import { colors } from '../../styles';

export const PageHeader = styled.div`
  background-color: ${colors.blue};
  display: flex;
  height: 5rem;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Logo = styled.img``;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const HeaderButton = styled.button`
  border: 1px solid ${colors.white};
  color: ${colors.white};
  border-radius: 5px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;

  svg {
    margin-right: 0.4rem;
  }
`;

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 1.5rem 1rem;
  overflow-x: auto;
`;

export const Title = styled.h1`
  color: ${colors.blue};
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
`;

export const Subtitle = styled.p`
  color: ${colors.gray};
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  max-width: 360px;
  border: 1px solid ${colors.grayLight};
  border-radius: 5px;
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  color: ${colors.black};
  font-size: 1rem;

  &::placeholder {
    color: ${colors.gray};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border: 0;
`;

export const TableHeader = styled.th`
  color: ${colors.black};
  text-align: left;
  padding: 0.5rem 0.4rem;
  border-bottom: 2px solid ${colors.grayLight};
`;

export const TableCell = styled.td`
  text-align: left;
  border: 1px solid ${colors.grayLighter};
  padding: 0.65rem 0.5rem;
  color: ${colors.black};
  vertical-align: middle;
`;

export const RoleBadge = styled.span<{ $admin?: boolean; $consultor?: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props =>
    props.$admin || props.$consultor ? colors.white : colors.black};
  background-color: ${props =>
    props.$admin
      ? colors.orange
      : props.$consultor
        ? colors.blue
        : colors.grayLight};
`;

export const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
`;

export const ToggleInput = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
`;

export const EmptyMessage = styled.p`
  color: ${colors.gray};
  font-size: 1.1rem;
  text-align: center;
  margin-top: 2rem;
`;

export const ErrorMessage = styled.p`
  color: ${colors.red};
  font-size: 1rem;
  margin-bottom: 1rem;
`;
