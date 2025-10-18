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
import FormFilter, { IFormFilterResolve } from '../../components/FormFilter';

import { getCurrentProjectLocal } from '../../services/projectService';
import useDeviceDimensions from '../../hooks/useDevice';
import { IField } from '../../components/Form';

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
  const [opened, setOpened] = useState<boolean>(false);
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
  const [expandedRowId, setExpandedRowId] = useState<string>('');
  const { getHistory, exportHistory } = historyService();
  const { loader, toggleLoader } = useLoader();
  const { t } = useTranslation();
  const { getFormatDay, getFormatMonth, getExtenseHour } = dateUtils();
  const { idProjeto, nome } = getCurrentProjectLocal();
  const [employees, setEmployees] = useState<Array<string>>([]);
  const [departments, setDepartments] = useState<Array<string>>([]);

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
        const href = URL.createObjectURL(response.data.data);

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
        console.log('arr', arr);
        const { data, employees, departments } = arr.data.data;
        setHistory(data);
        if (data.length) {
          if (departments.length > 1) setDepartments(['Selecione', ...departments]);
          if (employees.length > 1) setEmployees(['Selecione', ...employees]);
        }
      })
      .finally(() => toggleLoader(false));
  };

  useEffect(() => {
    changeSort();
  }, [sort]);

  useEffect(() => {
    setFormFieldsState({
      ...formFieldsState,
      project: { name: nome, id: idProjeto },
    });
  }, [idProjeto]);

  useEffect(() => {
    getHistoryItems();
  }, []);

  console.log(employees, departments);
  const handleClose = () => setOpened(!opened);
  return (
    <>
      <Header
        buttonExport={history.length > 0}
        onExport={handleOnExport}
        formFieldsState={formFieldsState}
        setFormFieldsState={setFormFieldsState}
        handleOpen={handleClose}
        onSubmit={(params: IFormFilterResolve) => handleOnSubmit(params)}
        isDesktop={isDesktop}
        employees={employees}
        departments={departments}
      />
      <S.Container>
        <S.Content className={isDesktop ? 'desktop' : ''}>
          {isDesktop && (
            <FormFilter
              formFieldsState={formFieldsState}
              opened={opened}
              handleClose={handleClose}
              setFormFieldsState={setFormFieldsState}
              onSubmit={(params: IFormFilterResolve) => {
                handleClose();
                handleOnSubmit(params);
              }}
              employees={employees}
              departments={departments}
              isDesktop={isDesktop}
            />
          )}
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
                      ...rest
                    },
                    index,
                  ) => (
                    <React.Fragment key={id}>
                      <TableRow
                        onClick={() =>
                          setExpandedRowId(expandedRowId === id ? '' : id)
                        }
                        style={{
                          cursor: 'pointer',
                          background:
                            expandedRowId === id ? '#f5f5f5' : undefined,
                        }}
                      >
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
                      {expandedRowId === id && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            style={{ background: '#fafafa' }}
                          >
                            <div style={{ padding: '16px' }}>
                              <strong>Detalhes:</strong>
                              <br />
                              Área: {department}
                              <br />
                              Funcionário: {employee}
                              <br />
                              Início: {dateStart}
                              <br />
                              Conclusão: {dateEnd}
                              <br />
                              Duração: {duration}
                              <br />
                              Status: {status ? 'Concluído' : 'Não Realizado'}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
