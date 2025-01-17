import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import historyService from '../../services/historyService';
import * as S from '../../components/Commons';
import {
  Button,
  FooterLanguageSelect,
  Header,
  STATUS,
  Status,
} from '../../components';
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
import FormFilter, { IFormFilterResolve } from '../../components/FormFilter';

import { getCurrentProjectLocal } from '../../services/projectService';
import useDeviceDimensions from '../../hooks/useDevice';
import Form, { IField } from '../../components/Form';

const today = new Date();

const statusFilterOptions = [
  { value: 'false', label: 'Não Realizado' },
  { value: 'true', label: 'Concluido' },
  { value: '', label: 'Todos' },
];

const History: FC = () => {
  const [history, setHistory] = useState<Array<IHistory>>([]);
  const [sort, setSort] = useState<string>('ASC');
  const [sortField, setSortField] = useState<string>('');
  const [opened, setOpened] = useState<boolean>(true);
  const { isDesktop } = useDeviceDimensions();
  const [formFieldsState, setFormFieldsState] = useState<IFormFilterResolve>({
    project: { name: '', id: 0 },
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
  const { idProjeto, nome } = getCurrentProjectLocal();

  function handleChangeFields(fieldName: string, value: string) {
    setFormFieldsState({ ...formFieldsState, [fieldName]: value });
  }
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
  const formFields: IField[] = [
    {
      type: 'select',
      name: 'project',
      placeholder: 'Projeto',
      value: idProjeto,
      disabled: true,
      onChange: (e: any) => {
        handleChangeFields('projeto', e.target.value);
      },
      options: [
        {
          key: 1,
          value: idProjeto,
          label: nome,
        },
      ],
      style: { width: '56%' },
    },
    {
      type: 'date',
      onChange: (e: any) => {
        handleChangeFields('initialDate', e.target.value);
      },
      name: 'initialDate',
      placeholder: t('filter.startDate'),
      value: formFieldsState.initialDate,
      style: { width: '20%' },
    },
    {
      type: 'date',
      onChange: (e: any) => {
        handleChangeFields('finishDate', e.target.value);
      },
      name: 'finishDate',
      placeholder: t('filter.finishDate'),
      value: formFieldsState.finishDate,
      style: { width: '20%' },
    },
    {
      type: 'text',
      onChange: (e: any) => {
        handleChangeFields('department', e.target.value);
      },
      name: 'department',
      placeholder: t('filter.department'),
      value: formFieldsState.department,
      style: { width: '42%' },
    },
    {
      type: 'text',
      onChange: (e: any) => {
        handleChangeFields('employee', e.target.value);
      },
      name: 'employee',
      placeholder: t('filter.employee'),
      value: formFieldsState.employee,
      style: { width: '43%' },
    },
    {
      type: 'select',
      name: 'status',
      placeholder: 'Status',
      value: formFieldsState.status,
      style: { width: '11%' },
      onChange: (e: any) => {
        handleChangeFields('status', e.target.value);
      },
      options: statusFilterOptions.map(({ value, label }, index) => ({
        key: index,
        value: value,
        label: label,
      })),
    },
  ];

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
    exportHistory(idProjeto, {
      DateEnd: new Date(formFieldsState.finishDate),
      DateStart: new Date(formFieldsState.initialDate),
      Department: formFieldsState.department,
      Employee: formFieldsState.employee,
      Status:
        formFieldsState.status === ''
          ? null
          : formFieldsState.status === 'true',
    })
      .then(response => {
        const href = URL.createObjectURL(response.data);

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute(
          'download',
          new Date().toISOString().split('T')[0] + '_history.xlsx',
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .finally(() => toggleLoader(false));
  };

  const getHistoryItems = (params?: any) => {
    toggleLoader(true);
    getHistory(idProjeto, {
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

  useEffect(() => {
    setFormFieldsState({
      ...formFieldsState,
      project: { name: nome, id: idProjeto },
    });
  }, [idProjeto]);

  return (
    <>
      <S.Container>
        <Header
          buttonExport={history.length > 0}
          onExport={handleOnExport}
          formFieldsState={formFieldsState}
          setFormFieldsState={setFormFieldsState}
          onSubmit={(params: IFormFilterResolve) => handleOnSubmit(params)}
          isDesktop={isDesktop}
        />
        {isDesktop && (
          <FormFilter
            formFieldsState={formFieldsState}
            opened={true}
            setFormFieldsState={setFormFieldsState}
            onSubmit={(params: IFormFilterResolve) => handleOnSubmit(params)}
            isDesktop={isDesktop}
          />
        )}
        <S.Content className={isDesktop ? 'desktop' : ''}>  
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
