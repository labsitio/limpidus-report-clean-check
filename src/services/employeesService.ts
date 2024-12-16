import api from './api';

export const getAllStatusPromise = (idProjeto: number) => {
  const allStatusPromise = api.get(`/projetos/${idProjeto}/statusAreas`);
  return allStatusPromise;
};

export const getAllDepartmentsPromise = (idProjeto: number) => {
  const allDepartmentsPromise = api.get(`/projetos/${idProjeto}/areas`);
  return allDepartmentsPromise;
};
