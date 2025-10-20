import { User } from '../interfaces';
import api from './api';

export const getProject = (login: string, password: string) => {
  return api.get<User>(`/projetos?login=${login}&senha=${password}`);
};

export const saveProjectLocal = (data: string): void => {
  localStorage.setItem('limpiduscleancheck@project', data);
};

export const getCurrentProjectLocal = (): any => {
  const data = localStorage.getItem('limpiduscleancheck@project');
  if (!data) {
    return null;
  }
  return JSON.parse(data);
};

export const cleanProjectLocal = (): any => {
  localStorage.removeItem('limpiduscleancheck@project');
};
