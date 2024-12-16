import React from 'react';
import * as S from './styles';
import IconAlert from '../../assets/iconAlert.svg';
import IconSuccess from '../../assets/iconSuccess.svg';
import IconDanger from '../../assets/iconDanger.svg';

export enum STATUS {
  SUCCESS,
  ALERT,
  DANGER,
}

interface StatusProps {
  status: STATUS;
  [key: string]: any;
}

const Status: React.FC<StatusProps> = ({ status, ...props }) => {
  const StatusItem = () => {
    switch (status) {
      case STATUS.SUCCESS:
        return <S.Status src={IconSuccess} />;
      case STATUS.ALERT:
        return <S.Status src={IconAlert} />;

      default:
        return <S.Status src={IconDanger} />;
    }
  };

  return (
    <S.Container {...props}>
      <StatusItem />
    </S.Container>
  );
};

export default Status;
