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
  showActivities: boolean;
  allowExcelExport: boolean;
  selectedIds: string[];
  allActivityIds: string[];
  availableActivities: ClientAccessData['availableActivities'];
  expanded: boolean;
  dirty: boolean;
  loading: boolean;
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
    // Admin/Consultor: catálogo completo via API. Franqueado: só allowedProjects da sessão.
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

  const mapAccessToDraft = (data: ClientAccessData): DraftRow => {
    const allIds = (data.availableActivities || []).map(a => a.itemId);
    const selected =
      data.clientVisibleActivityItemIds == null
        ? [...allIds]
        : data.clientVisibleActivityItemIds.filter(id => allIds.includes(id));

    return {
      legacyId: data.legacyId,
      projectName: data.projectName || String(data.legacyId),
      daysInput:
        data.maxHistoryRangeDays == null
          ? ''
          : String(data.maxHistoryRangeDays),
      showActivities: data.showActivitiesToClient !== false,
      allowExcelExport: data.allowExcelExport === true,
      selectedIds: selected,
      allActivityIds: allIds,
      availableActivities: data.availableActivities || [],
      expanded: false,
      dirty: false,
      loading: false,
    };
  };

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
            patch.showActivities !== undefined ||
            patch.allowExcelExport !== undefined ||
            patch.selectedIds !== undefined;
          if (touchesContent) next.dirty = true;
        }
        return next;
      }),
    );
  };

  const toggleActivity = (legacyId: number, itemId: string) => {
    setRows(prev =>
      prev.map(r => {
        if (r.legacyId !== legacyId) return r;
        const has = r.selectedIds.includes(itemId);
        return {
          ...r,
          dirty: true,
          selectedIds: has
            ? r.selectedIds.filter(id => id !== itemId)
            : [...r.selectedIds, itemId],
        };
      }),
    );
  };

  const selectAllActivities = (legacyId: number, all: boolean) => {
    setRows(prev =>
      prev.map(r =>
        r.legacyId === legacyId
          ? {
              ...r,
              dirty: true,
              selectedIds: all ? [...r.allActivityIds] : [],
            }
          : r,
      ),
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

    const visibleIds =
      row.selectedIds.length === row.allActivityIds.length
        ? null
        : row.selectedIds;

    setSavingId(row.legacyId);
    try {
      const { data } = await setClientAccess(row.legacyId, {
        maxHistoryRangeDays: days,
        showActivitiesToClient: row.showActivities,
        allowExcelExport: row.allowExcelExport,
        clientVisibleActivityItemIds: visibleIds,
        updateVisibleActivities: true,
      });
      if (!data?.success || !data.data) {
        throw new Error(data?.message || 'failed');
      }
      const next = mapAccessToDraft(data.data);
      setRows(prev =>
        prev.map(r =>
          r.legacyId === row.legacyId
            ? { ...next, expanded: r.expanded, dirty: false }
            : r,
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
                  <Translator path="clientAccess.colShowActivities" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colExcel" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colActivities" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="clientAccess.colActions" />
                </S.TableHeader>
              </S.TableRow>
            </S.TableHead>
            <S.TableBody>
              {filteredRows.map(row => (
                <React.Fragment key={row.legacyId}>
                  <S.TableRow>
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
                          checked={row.showActivities}
                          onChange={e =>
                            updateRow(row.legacyId, {
                              showActivities: e.target.checked,
                            })
                          }
                        />
                        <Translator path="clientAccess.showActivities" />
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
                      <CS.LinkButton
                        type="button"
                        disabled={!row.showActivities}
                        onClick={() =>
                          updateRow(row.legacyId, {
                            expanded: !row.expanded,
                          })
                        }
                      >
                        {row.expanded
                          ? t('clientAccess.hideList')
                          : t('clientAccess.manageActivities', {
                              count: row.selectedIds.length,
                              total: row.allActivityIds.length,
                            })}
                      </CS.LinkButton>
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
                  {row.expanded && row.showActivities && (
                    <S.TableRow>
                      <S.TableCell colSpan={6}>
                        <CS.ActivitiesPanel>
                          <CS.ActivitiesToolbar>
                            <CS.LinkButton
                              type="button"
                              onClick={() =>
                                selectAllActivities(row.legacyId, true)
                              }
                            >
                              {t('clientAccess.selectAll')}
                            </CS.LinkButton>
                            <CS.LinkButton
                              type="button"
                              onClick={() =>
                                selectAllActivities(row.legacyId, false)
                              }
                            >
                              {t('clientAccess.selectNone')}
                            </CS.LinkButton>
                          </CS.ActivitiesToolbar>
                          {row.availableActivities.length === 0 ? (
                            <CS.Hint>
                              <Translator path="clientAccess.noActivities" />
                            </CS.Hint>
                          ) : (
                            <CS.ActivitiesGrid>
                              {row.availableActivities.map(act => (
                                <S.ToggleLabel key={act.itemId}>
                                  <S.ToggleInput
                                    type="checkbox"
                                    checked={row.selectedIds.includes(
                                      act.itemId,
                                    )}
                                    onChange={() =>
                                      toggleActivity(row.legacyId, act.itemId)
                                    }
                                  />
                                  {act.name}
                                </S.ToggleLabel>
                              ))}
                            </CS.ActivitiesGrid>
                          )}
                        </CS.ActivitiesPanel>
                      </S.TableCell>
                    </S.TableRow>
                  )}
                </React.Fragment>
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
