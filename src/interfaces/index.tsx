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

export interface User {
  idProjeto: number;
  nome: string;
}

export interface IHistory {
  id: string;
  department: string;
  employee: string;
  dateStart: string;
  dateEnd: string;
  duration: string;
  status: boolean;
}
