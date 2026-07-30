import { AuthRole, User } from '../interfaces';
import { newAPI } from './api';

const STORAGE_KEY = 'limpiduscleancheck@project';

export type LoginType = 'auto' | 'project' | 'franqueado';

interface LoginApiResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    role: AuthRole;
    isFranqueado: boolean;
    isAdmin: boolean;
    franqId?: number | null;
    idProjeto: number;
    nome: string;
    allowedProjects?: Array<{ id: number; name: string }>;
    expiresAtUtc?: string;
  };
}

export const login = (login: string, password: string, type: LoginType = 'auto') => {
  return newAPI.post<LoginApiResponse>('/auth/login', {
    type,
    login,
    password,
  });
};

/** @deprecated use login — mantido se algum código legado ainda importar */
export const getProject = (loginName: string, password: string) => {
  return login(loginName, password, 'project').then(res => {
    const mapped: User = mapLoginToUser(res.data.data);
    return { ...res, data: mapped };
  });
};

export const mapLoginToUser = (data: LoginApiResponse['data']): User => ({
  idProjeto: data.idProjeto,
  nome: data.nome,
  token: data.token,
  role: data.role,
  isFranqueado: data.isFranqueado,
  isAdmin: data.isAdmin,
  franqId: data.franqId,
  allowedProjects: data.allowedProjects,
  expiresAtUtc: data.expiresAtUtc,
});

export const canExportReports = (user?: User | null): boolean => {
  if (!user?.role) return false;
  return (
    user.role === 'Franqueado' ||
    user.role === 'Consultor' ||
    user.role === 'Admin'
  );
};

export const isAdminUser = (user?: User | null): boolean => {
  if (!user) return false;
  return user.role === 'Admin' || user.isAdmin === true;
};

/** Franqueado ou Consultor: relatório completo / status concluído no filtro. */
export const isFranqueadoUser = (user?: User | null): boolean => {
  if (!user) return false;
  return user.role === 'Franqueado' || user.role === 'Consultor';
};

export const isSessionValid = (user?: User | null): boolean => {
  if (!user?.token) return false;
  if (!user.expiresAtUtc) return true;
  const expires = new Date(user.expiresAtUtc).getTime();
  return Number.isNaN(expires) || expires > Date.now();
};

export const saveProjectLocal = (data: string): void => {
  localStorage.setItem(STORAGE_KEY, data);
};

/** Atualiza o projeto selecionado na sessão (mantém token/role). */
export const selectProject = (projectId: number, projectName: string): User | null => {
  const current = getCurrentProjectLocal();
  if (!current) return null;
  const updated: User = {
    ...current,
    idProjeto: projectId,
    nome: projectName,
  };
  saveProjectLocal(JSON.stringify(updated));
  return updated;
};

export const getCurrentProjectLocal = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
};

export const cleanProjectLocal = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
