import { boolean } from 'yup';
import { useData } from '../hooks/data';
import { newAPI } from './api';
import * as mock from './mock.json';
import { IHistory } from '../interfaces';

export default function historyService() {
  function getHistory(idProjeto: number, query?: IHistoryRequest) {
    return newAPI.get<{
      data: {
        departments: Array<string>;
        employees: Array<{name: string; lastName: string}>;
        data: Array<IHistory>;
      };
      success: boolean;
    }>(`/history/legacyProjectId/${idProjeto}`, {
      params: query,
    });
  }
  function exportHistory(idProjeto: number, query?: IHistoryRequest) {
    return newAPI.get(`/history/export/legacyProjectId/${idProjeto}`, {
      params: query,
      responseType: 'blob',
    });
  }

  return {
    getHistory,
    exportHistory,
    getMock: () => mock,
  };
}

export interface IHistoryRequest {
  DateStart: Date;
  DateEnd: Date;
  Department: string;
  EmployeeName: string;
  EmployeeLastName: string;
  Status: boolean | null;
}
