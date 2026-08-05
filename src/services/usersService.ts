import { newAPI } from './api';

export type UserListRole = 'Admin' | 'Consultor' | 'Franqueado';

export interface FranqueadoUser {
  id: number;
  nome: string;
  login: string;
  isAdmin: boolean;
  isFranqueado: boolean;
  isConsultor?: boolean;
  role?: UserListRole;
  nivelId?: number | null;
  nivelNome?: string;
  nivelGrupoId?: number | null;
  grupos?: string;
}

interface UsersApiResponse {
  success: boolean;
  message?: string;
  data: FranqueadoUser[];
}

interface SetAdminApiResponse {
  success: boolean;
  message?: string;
  data: FranqueadoUser;
}

export const listUsers = () => {
  return newAPI.get<UsersApiResponse>('/users');
};

export const setAdmin = (franqId: number, isAdmin: boolean) => {
  return newAPI.put<SetAdminApiResponse>(`/users/${franqId}/admin`, {
    isAdmin,
  });
};
