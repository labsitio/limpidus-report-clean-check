export interface RawActivity {
  idTarefa: number;
  nomeTarefa: string;
  concluida: number;
  dataConclusao: string;
}

export interface RawArea {
  idArea: number;
  nomeArea: string;
  nome: string;
  sobrenome: string;
  idStatus: number;
  tempoExecucao: string;
  dataExecucao: string;
  tarefas: RawActivity[];
}

export interface Activity {
  idTarefa: number;
  nomeTarefa: string;
  concluida: number;
}

export interface Employee {
  nome: string;
  sobrenome: string;
}
export interface Area {
  idArea: number;
  nomeArea: string;
  funcionario: Employee;
  idStatus: number;
  dataInicio: string;
  dataConclusao: string;
  duracao: string;
  tarefas: Activity[];
}

export interface Department {
  id: string;
  nome: string;
}

export interface Status {
  idStatus: string;
  area: string;
  descricao: string;
}

export type AuthRole = 'Franqueado' | 'Consultor' | 'Admin' | 'ProjectViewer';

export interface AllowedProject {
  id: number;
  name: string;
  /** Nível Clean Check (NIVEL_PROJETO / Mongo level): 1, 2 ou 3. */
  level?: number;
}

export interface User {
  idProjeto: number;
  nome: string;
  token?: string;
  role?: AuthRole;
  isFranqueado?: boolean;
  isAdmin?: boolean;
  franqId?: number | null;
  allowedProjects?: AllowedProject[];
  expiresAtUtc?: string;
  /** Teto efetivo de dias no histórico (Admin: null = sem limite). */
  maxHistoryRangeDays?: number | null;
  /** Nível do projeto selecionado (NIVEL_PROJETO / Mongo level). */
  level?: number;
}

export interface IHistoryItem {
  id: string;
  name: string;
  orderBy?: number | null;
  endDate?: string;
  performed: boolean;
}

export interface IHistory {
  id: string;
  department: string;
  employeeName: string;
  employeeLastName: string;
  dateStart: string;
  dateEnd: string;
  duration: string;
  status: boolean;
  justification?: {
    information?: string;
    reason?: string;
  } | null;
  /** Presente apenas em projetos N2/N3; null/ausente em N1. */
  items?: IHistoryItem[] | null;
}
