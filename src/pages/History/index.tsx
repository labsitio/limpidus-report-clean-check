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

import {
  canExportReports,
  clampDateRange,
  daysAgoIsoDate,
  getCurrentProjectLocal,
  getEffectiveMaxRangeDays,
  isProjectViewerUser,
  todayIsoDate,
  toLocalIsoDate,
} from '../../services/projectService';
import useDeviceDimensions from '../../hooks/useDevice';
import { IHistoryItem } from '../../interfaces';

const today = new Date();

/** Status da área: com atividades → verde/amarelo/vermelho; sem → justificativa da API. */
const resolveAreaStatus = (
  status: boolean,
  items?: IHistoryItem[] | null,
): STATUS => {
  if (Array.isArray(items) && items.length > 0) {
    const allDone = items.every(i => i.performed);
    const noneDone = items.every(i => !i.performed);
    if (allDone) return STATUS.SUCCESS;
    if (noneDone) return STATUS.DANGER;
    return STATUS.ALERT;
  }
  return status ? STATUS.SUCCESS : STATUS.DANGER;
};

/** Cliente: oculta áreas com alguma atividade não realizada. */
const isVisibleToClient = (row: IHistory): boolean => {
  if (!Array.isArray(row.items) || row.items.length === 0) return true;
  return row.items.every(i => i.performed);
};

const History: FC = () => {
  const currentUser = getCurrentProjectLocal();
  const isProjectViewer = isProjectViewerUser(currentUser);
  const maxRangeDays = getEffectiveMaxRangeDays(currentUser);
  const viewerDefaultDays =
    typeof maxRangeDays === 'number' && maxRangeDays > 0 ? maxRangeDays : 90;
  const [history, setHistory] = useState<Array<IHistory>>([]);
  const [sort, setSort] = useState<string>('ASC');
  const [sortField, setSortField] = useState<string>('');
  const [opened, setOpened] = useState<boolean>(false);
  const { isDesktop } = useDeviceDimensions();
  const [formFieldsState, setFormFieldsState] = useState<IFormFilterResolve>({
    project: { name: '', id: 0 },
    initialDate: isProjectViewer
      ? daysAgoIsoDate(viewerDefaultDays, today)
      : toLocalIsoDate(
          new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
        ),
    finishDate: todayIsoDate(today),
    department: '',
    employee: '',
    // Cliente: só concluídas. Franqueado/Consultor/Admin: todos os status.
    status: isProjectViewer ? 'true' : '',
  });
  const [expandedRowId, setExpandedRowId] = useState<string>('');
  const { getHistory, exportHistory } = historyService();
  const { loader, toggleLoader } = useLoader();
  const { t } = useTranslation();
  const { getFormatDay, getFormatMonth, getExtenseHour } = dateUtils();
  const { idProjeto, nome } = currentUser || { idProjeto: 0, nome: '' };
  const allowExport = canExportReports(currentUser);
  const [employees, setEmployees] = useState<Array<string>>([]);
  const [departments, setDepartments] = useState<Array<string>>([]);
  const [isDateChanged, setIsDateChanged] = useState(false);

  const visibleHistory = isProjectViewer
    ? history.filter(isVisibleToClient)
    : history;

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
        ...history.sort((a, b) => a.employeeName.localeCompare(b.employeeName)),
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

  const normalizeFilterParams = (params: IFormFilterResolve): IFormFilterResolve => {
    const { initialDate, finishDate } = clampDateRange(
      params.initialDate,
      params.finishDate,
      maxRangeDays,
    );
    return {
      ...params,
      initialDate,
      finishDate,
      status: isProjectViewer ? 'true' : params.status,
    };
  };

  const handleOnSubmit = (params: IFormFilterResolve) => {
    const normalized = normalizeFilterParams(params);
    if (
      normalized.initialDate !== params.initialDate ||
      normalized.finishDate !== params.finishDate ||
      normalized.status !== params.status
    ) {
      setFormFieldsState(normalized);
    }
    getHistoryItems(normalized);
  };

  const handleOnExport = () => {
    const projectId =
      formFieldsState.project?.id || idProjeto;
    toggleLoader(true);
    exportHistory(projectId, {
      DateEnd: new Date(formFieldsState.finishDate),
      DateStart: new Date(formFieldsState.initialDate),
      Department: formFieldsState.department,
      EmployeeName: formFieldsState.employee.split(' ')[0],
      EmployeeLastName: formFieldsState.employee.split(' ').slice(1).join(' '),
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

  const getHistoryItems = (params?: IFormFilterResolve) => {
    const source = params || formFieldsState;
    const projectId = source.project?.id || idProjeto;
    if (!projectId) {
      setHistory([]);
      return;
    }
    toggleLoader(true);
    getHistory(projectId, {
      DateEnd: new Date(source.finishDate),
      DateStart: new Date(source.initialDate),
      Department: source.department,
      EmployeeName: source.employee.split(' ')[0],
      EmployeeLastName: source.employee.split(' ').slice(1).join(' '),
      Status:
        source.status === '' ? null : source.status === 'true',
    })
      .then(arr => {
        const {
          employees: _employees,
          departments: _departments,
          data = [],
        } = arr.data.data;
        setHistory(data);
        if (data.length) {
          if (!departments.length || isDateChanged)
            setDepartments(['Todos', ..._departments]);
          if (!employees.length || isDateChanged)
            setEmployees([
              'Todos',
              ..._employees.map(emp => `${emp.name} ${emp.lastName}`),
            ]);
          setIsDateChanged(false);
        } else {
          setDepartments([]);
          setEmployees([]);
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
    setIsDateChanged(true);
  }, [formFieldsState.initialDate, formFieldsState.finishDate]);

  useEffect(() => {
    getHistoryItems(normalizeFilterParams(formFieldsState));
  }, []);

  const handleClose = () => setOpened(!opened);
  return (
    <>
      <Header
        buttonExport={allowExport && history.length > 0}
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
          {visibleHistory.length > 0 && (
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
                {visibleHistory.map(
                  ({
                    id,
                    department,
                    employeeName,
                    employeeLastName,
                    dateStart,
                    dateEnd,
                    duration,
                    status,
                    items,
                  }) => (
                    <React.Fragment key={id}>
                      <TableRow
                        onClick={() => {
                          if (!Array.isArray(items) || items.length === 0) {
                            return;
                          }
                          setExpandedRowId(expandedRowId === id ? '' : id);
                        }}
                        style={{
                          cursor:
                            Array.isArray(items) && items.length > 0
                              ? 'pointer'
                              : 'default',
                          background:
                            expandedRowId === id ? '#f5f5f5' : undefined,
                        }}
                      >
                        <TableCell>{department}</TableCell>
                        <TableCell>
                          {employeeName + ' ' + employeeLastName}
                        </TableCell>
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
                          <ExtenseHour>
                            {Number(duration.replace(':', '').split('.')[0]) < 0
                              ? 0
                              : duration.split('.')[0].replace('-', '')}
                          </ExtenseHour>
                        </TableCell>
                        <TableCell>
                          <Status
                            status={resolveAreaStatus(status, items)}
                            style={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>
                      {expandedRowId === id &&
                        Array.isArray(items) &&
                        items.length > 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              style={{ background: '#fafafa' }}
                            >
                              <div style={{ padding: '16px' }}>
                                <strong>{t('dashboard.activities')}:</strong>
                                <ul
                                  style={{
                                    margin: '8px 0 0',
                                    paddingLeft: 18,
                                    listStyle: 'none',
                                  }}
                                >
                                  {items.map(item => (
                                    <li
                                      key={item.id || item.name}
                                      style={{
                                        marginBottom: 6,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                      }}
                                    >
                                      <span
                                        aria-label={
                                          item.performed
                                            ? t('dashboard.activityDone')
                                            : t('dashboard.activityPending')
                                        }
                                        title={
                                          item.performed
                                            ? t('dashboard.activityDone')
                                            : t('dashboard.activityPending')
                                        }
                                        style={{ fontSize: '1.15rem' }}
                                      >
                                        {item.performed ? '✅' : '❌'}
                                      </span>
                                      <span>{item.name}</span>
                                    </li>
                                  ))}
                                </ul>
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
          {visibleHistory.length === 0 && !loader && (
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
