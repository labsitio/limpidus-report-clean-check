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

/** Franqueado ou Consultor: relatório completo (todos os status, export, justificativa). */
export const isFranqueadoUser = (user?: User | null): boolean => {
  if (!user) return false;
  return user.role === 'Franqueado' || user.role === 'Consultor';
};

/** Cliente (login de projeto): só histórico concluído e range máx. 30 dias. */
export const isProjectViewerUser = (user?: User | null): boolean => {
  if (!user) return false;
  return user.role === 'ProjectViewer';
};

export const PROJECT_VIEWER_MAX_RANGE_DAYS = 30;

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Formata data local como YYYY-MM-DD (evita shift de fuso do toISOString). */
export const toLocalIsoDate = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Retorna data YYYY-MM-DD há `days` dias atrás (calendário local). */
export const daysAgoIsoDate = (days: number, from: Date = new Date()): string => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() - days);
  return toLocalIsoDate(d);
};

export const todayIsoDate = (from: Date = new Date()): string =>
  toLocalIsoDate(from);

/** Diferença em dias (calendário) entre duas datas YYYY-MM-DD. */
export const dateRangeDays = (initialDate: string, finishDate: string): number => {
  const start = new Date(`${initialDate}T00:00:00`);
  const end = new Date(`${finishDate}T00:00:00`);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/** Se o range exceder maxDays, ajusta initialDate para finishDate - maxDays. */
export const clampDateRange = (
  initialDate: string,
  finishDate: string,
  maxDays: number = PROJECT_VIEWER_MAX_RANGE_DAYS,
): { initialDate: string; finishDate: string; clamped: boolean } => {
  const days = dateRangeDays(initialDate, finishDate);
  if (Number.isNaN(days) || days <= maxDays) {
    return { initialDate, finishDate, clamped: false };
  }
  const end = new Date(`${finishDate}T00:00:00`);
  const clampedStart = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate() - maxDays,
  );
  return {
    initialDate: toLocalIsoDate(clampedStart),
    finishDate,
    clamped: true,
  };
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
