import React, { createContext, useContext, useState } from 'react';

import {
  Department,
  Status,
  RawArea,
  User,
  Employee,
  RawActivity,
  Area,
} from '../interfaces';
import * as ProjectService from '../services/projectService';
import { getRawActivitiesPromise } from '../services/activitiesService';
import { useLoader } from './loader';
import { addDurationInDate } from '../services/dateService';

export const FALLBACK_USER = {
  idProjeto: '0000',
  nome: 'Loading User',
};

export const INITIAL_STATUS = {
  idStatus: '0000',
  area: 'Loading Status',
  descricao: 'Loading Status',
};

export const INITIAL_DEPARTMENT = {
  id: '0000',
  nome: 'Loading Departments',
};

export const INITIAL_EMPLOYEES = [];

export const INITIAL_RAW_AREAS: RawArea[] = [];
interface ContextData {
  departments: Department[];
  status: Status[];
  rawAreas: RawArea[];
  user: User;
  employees: Employee[];
  areas: Array<Area>;
  baseAreas: Array<Area>;
  currentAreas: Array<Area>;
  handleFilter(): void;
  updateDepartment(departments: Department[]): void;
  updateStatus(status: Status[]): void;
  updateAreas(areas: Area[]): void;
  updateBaseAreas(areas: Area[]): void;
  updateRawAreas(rawAreas: RawArea[]): void;
  updateUser(user: User): void;
  updateEmployees(employees: Employee[]): void;
  filterEmployee(name: string, idArea: number): void;
  saveEmployees(areas: Area[], idArea?: number | undefined): void;
  getRequests(initialDate: Date, finishDate: Date, areaName?: string, orderBy?: string, idArea?: string): any;
  filterStatus(idStatus: string, idArea: number, employee: string): void;
  filterDepartment(idArea: number): void;
}

const AuthContext = createContext<ContextData>({} as ContextData);

const getIdStatus = (tarefas: RawActivity[]) => {
  const areActivitiesUnconcluded = tarefas.find(
    tarefa => tarefa.concluida === 0,
  );
  if (areActivitiesUnconcluded) {
    return 5;
  }
  return 1;
};

const getInitialDateString = (tarefas: RawActivity[]) => {
  const dates = getSortedDates(tarefas);
  const initialDate = dates[0];
  return initialDate.toString();
};

const getSortedDates = (tarefas: RawActivity[]) => {
  let dates = tarefas.map(tarefa => {
    const date = new Date(tarefa.dataConclusao);
    return date;
  });

  dates = dates.sort((a, b) => a.getTime() - b.getTime());
  return dates;
};

const getConclusionString = (tarefas: RawActivity[]) => {
  const dates = getSortedDates(tarefas);
  const conclusion = dates[dates.length - 1];
  return conclusion.toString();
};

const getDuration = (tarefas: RawActivity[]) => {
  const initialDate = new Date(getInitialDateString(tarefas));
  const conclusion = new Date(getConclusionString(tarefas));
  const durationMs = conclusion.getTime() - initialDate.getTime();
  const durationHr = Math.floor(durationMs / 3600000);
  const durationMin = Math.floor((durationMs / 3600000 - durationHr) * 60);
  return `${durationHr} H ${durationMin} min`;
};

const getActivities = (tarefas: RawActivity[]) => {
  return tarefas.sort(
    (a, b) =>
      new Date(a.dataConclusao).getTime() - new Date(b.dataConclusao).getTime(),
  );
};

const getArea = (rawArea: RawArea) => {
  const area: Area = {
    idArea: rawArea.idArea,
    funcionario: { nome: rawArea.nome, sobrenome: rawArea.sobrenome },
    nomeArea: rawArea.nomeArea,
    idStatus: getIdStatus(rawArea.tarefas),
    dataInicio: new Date(rawArea.dataExecucao).toString(),
    duracao: rawArea.tempoExecucao,
    dataConclusao: addDurationInDate(
      rawArea.tempoExecucao,
      new Date(rawArea.dataExecucao),
    ),
    tarefas: getActivities(rawArea.tarefas),
  };
  return area;
};

const DataProvider: React.FC = ({ children }) => {
  const getAreas = (currentRawAreas: RawArea[]) => {
    return currentRawAreas.map(rawArea => getArea(rawArea));
  };

  const [departments, setDepartments] = useState<Department[]>([
    INITIAL_DEPARTMENT,
  ]);

  const { toggleLoader } = useLoader();
  const [status, setStatus] = useState<Status[]>([INITIAL_STATUS]);
  const [rawAreas, setRawAreas] = useState<RawArea[]>(INITIAL_RAW_AREAS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [areas, setAreas] = useState<Array<Area>>(getAreas(rawAreas));
  const [currentAreas, setCurrentAreas] = useState<Array<Area>>([]);
  const [baseAreas, setBaseAreas] = useState<Array<Area>>(getAreas(rawAreas));
  const [user, setUser] = useState<User>(
    ProjectService.getCurrentProjectLocal(),
  );

  const updateDepartment = (newDepartments: Department[]): void => {
    setDepartments(newDepartments);
  };

  const handleFilter = () => {
    setCurrentAreas(baseAreas);
  };

  const updateUser = (newUser: User) => {
    ProjectService.saveProjectLocal(JSON.stringify(newUser));
    setUser(newUser);
  };

  const updateStatus = (newStatus: Status[]): void => {
    setStatus(newStatus);
  };

  const updateRawAreas = (newRawAreas: RawArea[]): void => {
    setRawAreas(newRawAreas);
  };

  const updateEmployees = (newEmployees: Employee[]): void => {
    setEmployees(newEmployees);
  };

  const updateAreas = (newAreas: Area[]): void => {
    setAreas(newAreas);
  };

  const updateBaseAreas = (newAreas: Area[]): void => {
    setBaseAreas(newAreas);
  };

  const getRequests = async (
    initialDate: Date = new Date(),
    finishDate: Date = new Date(),
    areaName: string,
    orderBy: string,
    idArea: string,
  ) => {
    const currentRawAreas = await getRawAreas(
      user.idProjeto,
      initialDate,
      finishDate,
      areaName,
      orderBy,
      idArea
    );
    const currentAreasData = getAreas(currentRawAreas);
    saveDepartments(currentAreasData);
    saveStatus(currentAreasData);
    saveEmployees(currentAreasData);
    setAreas(currentAreasData);
    setBaseAreas(currentAreasData);
    setCurrentAreas(currentAreasData);
  };

  const saveStatus = (areasList: Array<Area>) => {
    const currentStatus = areasList.map(area => {
      let descricao = '';
      if (area.idStatus === 1) {
        descricao = 'Serviço Realizado';
      } else if (area.idStatus === 3) {
        descricao = 'Serviço Não Realizado';
      } else {
        descricao = 'Andamento/Não Concluído';
      }
      return {
        idStatus: String(area.idStatus),
        descricao,
        area: area.nomeArea,
      };
    });
    updateStatus(currentStatus);
  };

  const getRawAreas = async (
    idProjeto: number,
    initialDate: Date,
    finalDate: Date,
    areaName: string,
    orderBy: string,
    idArea: string
  ) => {
    try {
      toggleLoader(true);
      const rawAreasPromise = await getRawActivitiesPromise(
        idProjeto,
        initialDate,
        finalDate,
        areaName,
        orderBy,
        idArea
      );
      const rawAreasData = rawAreasPromise.data.data;
      updateRawAreas(rawAreasData);

      return rawAreasData;
    } catch (error) {
      console.log(error);
    } finally {
      console.log('finalizou');
      toggleLoader(false);
    }
    return rawAreas;
  };

  const saveDepartments = (areasList: Array<Area>) => {
    const currentDepartments = areasList.map(area => {
      const id = String(area.idArea);
      const nome = area.nomeArea;
      return { id, nome };
    });
    updateDepartment(currentDepartments);
  };

  const saveEmployees = (areasList: Array<Area>, idArea?: number) => {
    toggleLoader(true);
    let areasCopy = areasList;
    if (idArea) {
      areasCopy = areasList.filter(area => area.idArea === idArea);
    }
    setBaseAreas(areasCopy);
    const currentEmployees = areasCopy.map(area => {
      return area.funcionario;
    });
    updateEmployees(currentEmployees);
    toggleLoader(false);
  };

  const filterDepartment = (idArea: number) => {
    toggleLoader(true);
    const areaFiltered = areas.filter(area => area.idArea === idArea);
    const currentEmployees = areaFiltered.map(area => {
      return area.funcionario;
    });
    setBaseAreas(areaFiltered);
    updateEmployees(currentEmployees);
    toggleLoader(false);
  };

  const filterEmployee = (name: string, idArea: number) => {
    const [firstName, lastName] = name.split('|');
    const areaFiltered = areas.filter(area => {
      return (
        area.idArea === idArea &&
        area.funcionario.nome.includes(firstName) &&
        area.funcionario.sobrenome.includes(lastName)
      );
    });
    saveStatus(areaFiltered);
    setBaseAreas(areaFiltered);
  };

  const filterStatus = (idStatus: string, idArea: number, employee: string) => {
    const [firstName, lastName] = employee.split('|');
    const areaFiltered = areas.filter(
      area =>
        area.idArea === idArea &&
        area.funcionario.nome.includes(firstName) &&
        area.funcionario.sobrenome.includes(lastName) &&
        area.idStatus === Number(idStatus),
    );
    saveStatus(areaFiltered);
    setBaseAreas(areaFiltered);
  };

  return (
    <AuthContext.Provider
      value={{
        areas,
        baseAreas,
        departments,
        status,
        rawAreas,
        user,
        employees,
        currentAreas,
        updateAreas,
        updateBaseAreas,
        updateDepartment,
        updateRawAreas,
        updateStatus,
        updateUser,
        updateEmployees,
        getRequests,
        saveEmployees,
        filterEmployee,
        filterStatus,
        filterDepartment,
        handleFilter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useData(): ContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useData must be used within an AuthProvider');
  }

  return context;
}

export { DataProvider, useData };
