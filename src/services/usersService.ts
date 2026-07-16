import { newAPI } from './api';

export interface FranqueadoUser {
  id: number;
  nome: string;
  login: string;
  isAdmin: boolean;
  isFranqueado: boolean;
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
