import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi';
import { MdHistory } from 'react-icons/md';

import LogoCleanCheck from '../../assets/cleanCheckLogo.svg';
import { FooterLanguageSelect, Translator } from '../../components';
import { useLoader } from '../../hooks/loader';
import {
  canManageClientAccess,
  canSeeAllClientAccessProjects,
  cleanProjectLocal,
  ClientAccessData,
  getClientAccess,
  getCurrentProjectLocal,
  listProjectsForClientAccess,
  setClientAccess,
} from '../../services/projectService';
import * as S from '../Users/styles';
import * as CS from './styles';

type DraftRow = {
  legacyId: number;
  projectName: string;
  daysInput: string;
  showUnperformed: boolean;
  allowExcelExport: boolean;
  dirty: boolean;
};

const ClientAccess: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { toggleLoader } = useLoader();
  const currentUser = getCurrentProjectLocal();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [projectList, setProjectList] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const seeAllProjects = canSeeAllClientAccessProjects(currentUser);

  const resolveProjectList = useCallback(async () => {
    if (seeAllProjects) {
      return listProjectsForClientAccess();
    }

    const allowed = currentUser?.allowedProjects || [];
    if (allowed.length > 0) {
      return allowed.map(p => ({ id: p.id, name: p.name || String(p.id) }));
    }
    if (currentUser?.idProjeto) {
      return [
        {
          id: currentUser.idProjeto,
          name: currentUser.nome || String(currentUser.idProjeto),
        },
      ];
    }
    return [];
  }, [currentUser, seeAllProjects]);

  const mapAccessToDraft = (data: ClientAccessData): DraftRow => ({
    legacyId: data.legacyId,
    projectName: data.projectName || String(data.legacyId),
    daysInput:
      data.maxHistoryRangeDays == null ? '' : String(data.maxHistoryRangeDays),
    showUnperformed: data.showUnperformedActivitiesToClient === true,
    allowExcelExport: data.allowExcelExport === true,
    dirty: false,
  });

  const projectsToFetch = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = projectList;
    if (term) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          String(p.id).includes(term),
      );
    } else if (list.length > 25) {
      const currentId = currentUser?.idProjeto;
      list = list.filter(p => p.id === currentId);
      if (list.length === 0) list = projectList.slice(0, 1);
    }
    return list.slice(0, 25);
  }, [projectList, search, currentUser?.idProjeto]);

  const loadCatalog = useCallback(async () => {
    if (!canManageClientAccess(currentUser)) return;
    try {
      const list = await resolveProjectList();
      setProjectList(list);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || t('clientAccess.loadError'),
      );
      setProjectList([]);
    }
  }, [currentUser, resolveProjectList, t]);

  const loadAll = useCallback(async () => {
    if (!canManageClientAccess(currentUser)) return;
    if (projectsToFetch.length === 0) {
      setRows([]);
      return;
    }
    toggleLoader(true);
    setError('');
    try {
      const results = await Promise.all(
        projectsToFetch.map(async p => {
          const { data } = await getClientAccess(p.id);
          if (!data?.success || !data.data) {
            throw new Error(data?.message || 'failed');
          }
          const draft = mapAccessToDraft(data.data);
          if (!draft.projectName) draft.projectName = p.name;
          return draft;
        }),
      );
      setRows(results);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || t('clientAccess.loadError'),
      );
      setRows([]);
    } finally {
      toggleLoader(false);
    }
  }, [currentUser, projectsToFetch, t, toggleLoader]);

  useEffect(() => {
    if (!canManageClientAccess(getCurrentProjectLocal())) {
      history.replace('/history');
      return;
    }
    loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canManageClientAccess(getCurrentProjectLocal())) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsToFetch]);

  const filteredRows = rows;

  const updateRow = (legacyId: number, patch: Partial<DraftRow>) => {
    setRows(prev =>
      prev.map(r => {
        if (r.legacyId !== legacyId) return r;
        const next = { ...r, ...patch };
        if (patch.dirty === undefined) {
          const touchesContent =
            patch.daysInput !== undefined ||
            patch.showUnperformed !== undefined ||
            patch.allowExcelExport !== undefined;
          if (touchesContent) next.dirty = true;
        }
        return next;
      }),
    );
  };

  const handleSave = async (row: DraftRow) => {
    if (savingId != null) return;
    const trimmed = row.daysInput.trim();
    let days: number | null = null;
    if (trimmed !== '') {
      const parsed = Number(trimmed);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        toast.error(t('clientAccess.daysInvalid'));
        return;
      }
      days = parsed;
    }

    setSavingId(row.legacyId);
    try {
      const { data } = await setClientAccess(row.legacyId, {
        maxHistoryRangeDays: days,
        showUnperformedActivitiesToClient: row.showUnperformed,
        allowExcelExport: row.allowExcelExport,
      });
      if (!data?.success || !data.data) {
        throw new Error(data?.message || 'failed');
      }
      const next = mapAccessToDraft(data.data);
      setRows(prev =>
        prev.map(r =>
          r.legacyId === row.legacyId ? { ...next, dirty: false } : r,
        ),
      );
      toast.success(t('clientAccess.saveSuccess'));
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || t('clientAccess.saveError'),
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleExit = () => {
    cleanProjectLocal();
    history.push('/login');
  };

  if (!canManageClientAccess(currentUser)) {
    return null;
  }

  return (
    <>
      <S.PageHeader>
        <S.Logo src={LogoCleanCheck} alt="CleanCheck logotipo" />
        <S.HeaderActions>
          <S.HeaderButton type="button" onClick={() => history.push('/history')}>
            <MdHistory />
            <Translator path="clientAccess.backToHistory" />
          </S.HeaderButton>
          <S.HeaderButton type="button" onClick={handleExit}>
            <FiLogOut />
            <Translator path="filter.exit" />
          </S.HeaderButton>
        </S.HeaderActions>
      </S.PageHeader>

      <S.Container>
        <S.Title>
          <Translator path="clientAccess.title" />
        </S.Title>
        <S.Subtitle>
          <Translator path="clientAccess.subtitle" />
        </S.Subtitle>

        <S.SearchInput
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('clientAccess.searchPlaceholder')}
        />

        {projectList.length > 25 && !search.trim() && (
          <CS.Hint style={{ marginBottom: '1rem' }}>
            <Translator path="clientAccess.searchHint" />
          </CS.Hint>
        )}

        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        {filteredRows.length === 0 && !error ? (
          <S.EmptyMessage>
            <Translator path="clientAccess.empty" />
          </S.EmptyMessage>
        ) : (
          <S.Table>
            <S.TableHead>
              <S.TableRow>
                <S.TableHeader>
                  <Translator path="clientAccess.colProject" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colDays" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colUnperformed" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colExcel" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colActions" />
                </S.TableHeader>
              </S.TableRow>
            </S.TableHead>
            <S.TableBody>
              {filteredRows.map(row => (
                <S.TableRow key={row.legacyId}>
                  <S.TableCell>
                    <CS.ProjectName>{row.projectName}</CS.ProjectName>
                    <CS.ProjectId>ID {row.legacyId}</CS.ProjectId>
                  </S.TableCell>
                  <S.TableCell>
                    <CS.DaysInput
                      type="number"
                      min={1}
                      placeholder="90"
                      value={row.daysInput}
                      onChange={e =>
                        updateRow(row.legacyId, {
                          daysInput: e.target.value,
                        })
                      }
                    />
                    <CS.Hint>
                      <Translator path="clientAccess.daysHint" />
                    </CS.Hint>
                  </S.TableCell>
                  <S.TableCell>
                    <S.ToggleLabel>
                      <S.ToggleInput
                        type="checkbox"
                        checked={row.showUnperformed}
                        onChange={e =>
                          updateRow(row.legacyId, {
                            showUnperformed: e.target.checked,
                          })
                        }
                      />
                      <Translator path="clientAccess.showUnperformed" />
                    </S.ToggleLabel>
                  </S.TableCell>
                  <S.TableCell>
                    <S.ToggleLabel>
                      <S.ToggleInput
                        type="checkbox"
                        checked={row.allowExcelExport}
                        onChange={e =>
                          updateRow(row.legacyId, {
                            allowExcelExport: e.target.checked,
                          })
                        }
                      />
                      <Translator path="clientAccess.allowExcel" />
                    </S.ToggleLabel>
                  </S.TableCell>
                  <S.TableCell>
                    <CS.SaveButton
                      type="button"
                      disabled={savingId === row.legacyId || !row.dirty}
                      onClick={() => handleSave(row)}
                    >
                      {savingId === row.legacyId
                        ? '...'
                        : t('clientAccess.save')}
                    </CS.SaveButton>
                  </S.TableCell>
                </S.TableRow>
              ))}
            </S.TableBody>
          </S.Table>
        )}
      </S.Container>
      <FooterLanguageSelect />
    </>
  );
};

export default ClientAccess;
