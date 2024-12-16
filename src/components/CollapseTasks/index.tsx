import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import * as S from './styles';
import Status, { STATUS } from '../Status';
import Translator from '../Translator';
import { Activity } from '../../interfaces';

interface CollapseTasksProps {
  isOpened: boolean;
  activities: Activity[];
}

const CollapseTasks = (props: CollapseTasksProps) => {
  const getStatus = (status: number) => {
    if (status === 0) {
      return STATUS.DANGER;
    }
    return STATUS.SUCCESS;
  };

  return (
    <Collapse isOpened={props.isOpened}>
      <S.ListTasks>
        {props.activities.map(activity => {
          return (
            <S.TaskItem>
              <S.TaskTitle>{activity.nomeTarefa}</S.TaskTitle>
              <Status status={getStatus(activity.concluida)} />
            </S.TaskItem>
          );
        })}
      </S.ListTasks>
    </Collapse>
  );
};

export default CollapseTasks;
