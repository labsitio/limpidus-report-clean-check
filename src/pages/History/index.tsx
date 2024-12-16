import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import historyService from '../../services/historyService';
import * as S from '../../components/Commons';
import { FooterLanguageSelect, Header, STATUS, Status } from '../../components';
import { useLoader } from '../../hooks/loader';
import { IHistory } from '../../interfaces';
import {
  DateSessionFormater,
  ExtenseHour,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TouchableHeader,
} from './styles';
import DateFormater from '../../components/DateFormater';
import { dateUtils } from '../../utils/dateUtils';
import { IFormFilterResolve } from '../../components/FormFilter';
import { useData } from '../../hooks/data';

const today = new Date();

const History: FC = () => {
  const [history, setHistory] = useState<Array<IHistory>>([]);
  const [sort, setSort] = useState<string>('ASC');
  const [sortField, setSortField] = useState<string>('');
  const [formFieldsState, setFormFieldsState] = useState<IFormFilterResolve>({
    initialDate: new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      today.getDay(),
    )
      .toISOString()
      .split('T')[0],
    finishDate: new Date().toISOString().split('T')[0],
    department: '',
    employee: '',
    status: '',
  });
  const { getHistory, exportHistory } = historyService();
  const { loader, toggleLoader } = useLoader();
  const { t } = useTranslation();
  const { getFormatDay, getFormatMonth, getExtenseHour } = dateUtils();
  const { user } = useData();

  function handleSort(fieldName: string) {
    setSortField(fieldName);
    if (fieldName === sortField && sort === 'ASC') {
      setHistory([...history.reverse()]);
      setSort('DESC');
    } else if (fieldName !== sortField && sort === 'ASC') {
      changeSort();
      setHistory([...history.reverse()]);
      setSort('DESC');
    } else if (sort === 'DESC') {
      setSort('ASC');
    }
  }

  function changeSort() {
    if (sortField === 'area' && sort === 'ASC')
      setHistory([
        ...history.sort((a, b) => a.department.localeCompare(b.department)),
      ]);
    if (sortField === 'employee' && sort === 'ASC')
      setHistory([
        ...history.sort((a, b) => a.employee.localeCompare(b.employee)),
      ]);
    if (sortField === 'start' && sort === 'ASC')
      setHistory([
        ...history.sort((a, b) => (a.dateStart > b.dateStart ? 1 : -1)),
      ]);
    if (sortField === 'conclusion' && sort === 'ASC')
      setHistory([...history.sort((a, b) => (a.dateEnd > b.dateEnd ? 1 : -1))]);
    if (sortField === 'duration' && sort === 'ASC')
      setHistory([
        ...history.sort((a, b) => (a.duration > b.duration ? 1 : -1)),
      ]);
    if (sortField === 'status' && sort === 'ASC')
      setHistory([...history.sort((a, b) => (a.status === b.status ? 1 : -1))]);
  }

  const handleOnSubmit = (params: IFormFilterResolve) => {
    getHistoryItems(params);
  };

  const handleOnExport = () => {
    toggleLoader(true);
    exportHistory(4698, {
      DateEnd: new Date(formFieldsState.finishDate),
      DateStart: new Date(formFieldsState.initialDate),
      Department: formFieldsState.department,
      Employee: formFieldsState.employee,
      Status:
        formFieldsState.status === ''
          ? null
          : formFieldsState.status === 'true',
    }).then((response) =>{
      
      const href = URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', new Date().toISOString().split('T')[0] + '_history.xlsx'); 
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }).finally(() => toggleLoader(false));
  };

  const getHistoryItems = (params?: any) => {
    toggleLoader(true);
    getHistory(4698, {
      DateEnd: new Date(formFieldsState.finishDate),
      DateStart: new Date(formFieldsState.initialDate),
      Department: formFieldsState.department,
      Employee: formFieldsState.employee,
      Status:
        formFieldsState.status === ''
          ? null
          : formFieldsState.status === 'true',
    })
      .then(arr => {
        setHistory(arr.data.data);
      })
      .finally(() => toggleLoader(false));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getHistoryItems();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [formFieldsState]);

  useEffect(() => {
    changeSort();
  }, [sort]);

  return (
    <>
      <S.Container>
        <Header
          buttonExport={history.length}
          onExport={handleOnExport}
          formFieldsState={formFieldsState}
          setFormFieldsState={setFormFieldsState}
          onSubmit={(params: IFormFilterResolve) => handleOnSubmit(params)}
        />
        <S.Content>
          {history.length > 0 && (
            <Table>
              <TableHead>
                <TableHeader>
                  <TouchableHeader onClick={() => handleSort('area')}>
                    {t('dashboard.area')}
                  </TouchableHeader>
                </TableHeader>
                <TableHeader>
                  <TouchableHeader onClick={() => handleSort('employee')}>
                    {t('dashboard.employee')}
                  </TouchableHeader>
                </TableHeader>
                <TableHeader>
                  <TouchableHeader onClick={() => handleSort('start')}>
                    {t('dashboard.start')}
                  </TouchableHeader>
                </TableHeader>
                <TableHeader>
                  <TouchableHeader onClick={() => handleSort('conclusion')}>
                    {t('dashboard.conclusion')}
                  </TouchableHeader>
                </TableHeader>
                <TableHeader>
                  <TouchableHeader onClick={() => handleSort('duration')}>
                    {t('dashboard.duration')}
                  </TouchableHeader>
                </TableHeader>
                <TableHeader>
                  <TouchableHeader onClick={() => handleSort('status')}>
                    {t('dashboard.status')}
                  </TouchableHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {history.map(
                  (
                    {
                      id,
                      department,
                      employee,
                      dateStart,
                      dateEnd,
                      duration,
                      status,
                    },
                    index,
                  ) => (
                    <TableRow key={id}>
                      <TableCell>{department}</TableCell>
                      <TableCell>{employee}</TableCell>
                      <TableCell>
                        <DateSessionFormater>
                          <DateFormater
                            day={getFormatDay(new Date(dateStart))}
                            month={getFormatMonth(new Date(dateStart))}
                            year={String(new Date(dateStart).getFullYear())}
                          />
                          <ExtenseHour>
                            {getExtenseHour(new Date(dateStart))}
                          </ExtenseHour>
                        </DateSessionFormater>
                      </TableCell>
                      <TableCell>
                        <DateSessionFormater>
                          <DateFormater
                            day={getFormatDay(new Date(dateEnd))}
                            month={getFormatMonth(new Date(dateEnd))}
                            year={String(new Date(dateEnd).getFullYear())}
                          />
                          <ExtenseHour>
                            {getExtenseHour(new Date(dateEnd))}
                          </ExtenseHour>
                        </DateSessionFormater>
                      </TableCell>
                      <TableCell>
                        <ExtenseHour>{duration.split('.')[0]}</ExtenseHour>
                      </TableCell>
                      <TableCell>
                        <Status
                          status={status ? STATUS.SUCCESS : STATUS.DANGER}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
          {history.length === 0 && !loader && (
            <S.MessageItemNotFound>
              {t('dashboard.messageNotFound')}
            </S.MessageItemNotFound>
          )}
        </S.Content>
      </S.Container>
      <FooterLanguageSelect />
    </>
  );
};

export default History;
