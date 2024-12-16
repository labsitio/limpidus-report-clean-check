import React, { useState } from 'react';
import * as S from './styles';
import ArrowIcon from '../../assets/arrowIcon.svg';
import CollapseTasks from '../CollapseTasks';
import Status, { STATUS } from '../Status';
import { Area } from '../../interfaces';
import Translator from '../Translator';

import DateFormater from '../DateFormater';
import { SortableHeaderName } from "./styles";
import { useData } from "../../hooks/data";
import { dateUtils } from '../../utils/dateUtils';

interface Props {
  area: Area;
  isFirst?: boolean;
}

const AreaItem = (props: Props) => {
  const { getRequests } = useData();
  const [isOpened, setOpened] = useState(false);
  const [orderBy, setOrderBy] = useState<string>("ASC");
  const initialDate = new Date(props.area.dataInicio);
  const conclusionDate = new Date(props.area.dataConclusao);
  const { getFormatDay, getFormatMonth, getExtenseHour } = dateUtils();

  const getStatus = () => {
    if (props.area.tarefas.every(tarefa => tarefa.concluida === 1)) {
      return STATUS.SUCCESS;
    }
    if (props.area.tarefas.every(tarefa => tarefa.concluida === 0)) {
      return STATUS.DANGER;
    }
    return STATUS.ALERT;
  };

  const sortBy = (fieldName: string) => {
    const initialDate = new Date(localStorage.getItem("limpidusInitialDate") || "");
    const conclusionDate = new Date(localStorage.getItem("limpidusFinishDate") || "");
    const idArea = localStorage.getItem("limpidusIdArea") || "";
    const order = orderBy === "ASC" ? "DESC" : "ASC";

    setOrderBy(order);
    getRequests(initialDate, conclusionDate, fieldName, order, idArea);
  }

  return (
    <S.AreaCollapseWrapper>
      <S.AreaItem>
        <S.AlignedToHeaders>
          <S.Item containerMax>
            {props.isFirst && (
              <S.SortableHeaderName onClick={() => sortBy("nomeArea")}>
                <Translator path="dashboard.area" />{' '}
              </S.SortableHeaderName>
            )}
            <S.ItemContent>
              <S.Title>{props.area.nomeArea}</S.Title>
            </S.ItemContent>
          </S.Item>

          <S.Item containerMax>
            {props.isFirst && (
              <S.SortableHeaderName onClick={() => sortBy("funcionario.nome")}>
                <Translator path="dashboard.employee" />{' '}
              </S.SortableHeaderName>
            )}
            <S.ItemContent>
              <S.EmployeeName>{`${props.area.funcionario.nome} ${props.area.funcionario.sobrenome}`}</S.EmployeeName>
            </S.ItemContent>
          </S.Item>

          <S.Item>
            {props.isFirst && (
              <S.SortableHeaderName onClick={() => sortBy("dataExecucao")}>
                <Translator path="dashboard.start" />
              </S.SortableHeaderName>
            )}
            <S.ItemContent>
              <DateFormater
                day={getFormatDay(initialDate)}
                month={getFormatMonth(initialDate)}
                year={String(initialDate.getFullYear())}
              />
              <S.ExtenseHour>{getExtenseHour(initialDate)}</S.ExtenseHour>
            </S.ItemContent>
          </S.Item>

          <S.Item>
            {props.isFirst && (
              <S.SortableHeaderName onClick={() => sortBy("dataExecucao")}>
                <Translator path="dashboard.conclusion" />
              </S.SortableHeaderName>
            )}
            <S.ItemContent>
              <DateFormater
                day={getFormatDay(conclusionDate)}
                month={getFormatMonth(conclusionDate)}
                year={String(conclusionDate.getFullYear())}
              />
              <S.ExtenseHour>{getExtenseHour(conclusionDate)}</S.ExtenseHour>
            </S.ItemContent>
          </S.Item>
          <S.Item>
            {props.isFirst && (
              <S.HeaderName>
                <Translator path="dashboard.duration" />
              </S.HeaderName>
            )}
            <S.ItemContent>
              <S.ExtenseHour>{props.area.duracao}</S.ExtenseHour>
            </S.ItemContent>
          </S.Item>
          <S.Item>
            {props.isFirst && (
              <S.HeaderName>
                <Translator path="dashboard.status" />
              </S.HeaderName>
            )}
            <S.ItemContent>
              <S.StatusWrapper>
                <Status status={getStatus()} />
              </S.StatusWrapper>
              {props.area.tarefas.length > 0 && (
                <S.ArrowWrapper>
                  <S.ButtonArrow
                    onClick={() => setOpened(!isOpened)}
                    isOpened={isOpened}
                  >
                    <S.Arrow src={ArrowIcon} />
                  </S.ButtonArrow>
                </S.ArrowWrapper>
              )}
            </S.ItemContent>
          </S.Item>
        </S.AlignedToHeaders>
      </S.AreaItem>
      <CollapseTasks isOpened={isOpened} activities={props.area.tarefas} />
    </S.AreaCollapseWrapper>
  );
};

export default AreaItem;
