import styled from 'styled-components';
import { colors } from '../../styles';

export const ProjectName = styled.div`
  font-weight: 600;
  color: ${colors.black};
`;

export const ProjectId = styled.div`
  font-size: 0.8rem;
  color: ${colors.gray};
  margin-top: 0.15rem;
`;

export const DaysInput = styled.input`
  width: 5.5rem;
  border: 1px solid ${colors.grayLight};
  border-radius: 5px;
  padding: 0.45rem 0.5rem;
  font-size: 0.95rem;
  color: ${colors.black};
`;

export const Hint = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: ${colors.gray};
`;

export const LinkButton = styled.button`
  border: none;
  background: transparent;
  color: ${colors.blue};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  text-decoration: underline;

  &:disabled {
    color: ${colors.gray};
    cursor: not-allowed;
    text-decoration: none;
  }
`;

export const SaveButton = styled.button`
  border: none;
  border-radius: 5px;
  background-color: ${colors.orange};
  color: ${colors.white};
  padding: 0.45rem 0.85rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActivitiesPanel = styled.div`
  padding: 0.75rem 0.25rem 0.5rem;
`;

export const ActivitiesToolbar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

export const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.55rem 1rem;
`;
