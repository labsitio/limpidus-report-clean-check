import { add, format } from "date-fns";
import api from "./api";

export const getRawActivitiesPromise = (
  idProjeto: number,
  initialDate: Date,
  finalDate: Date,
  areaName: string = "nomeArea",
  orderBy: string = "ASC",
  idArea?: string
) => {
  const finalDateNew = add(finalDate, { days: 1 });

  const initialDateString = format(initialDate, 'yyyy-MM-dd');
  const finalDateString = format(finalDateNew, 'yyyy-MM-dd');

  return api.get(`/projetos/${idProjeto}/atividades?dataInicial=${initialDateString}&dataFinal=${finalDateString}&colOrdem=${areaName}&dirOrdem=${orderBy}&idArea=${idArea}`);
};
