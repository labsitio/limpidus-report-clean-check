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
  cleanProjectLocal,
  getCurrentProjectLocal,
  isAdminUser,
} from '../../services/projectService';
import {
  FranqueadoUser,
  listUsers,
  setAdmin,
} from '../../services/usersService';
import * as S from './styles';

const Users: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { toggleLoader } = useLoader();
  const currentUser = getCurrentProjectLocal();
  const [users, setUsers] = useState<FranqueadoUser[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    toggleLoader(true);
    setError('');
    try {
      const { data } = await listUsers();
      if (!data?.success || !Array.isArray(data.data)) {
        throw new Error(data?.message || 'failed');
      }
      setUsers(data.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        t('users.loadError');
      setError(message);
      setUsers([]);
    } finally {
      toggleLoader(false);
    }
  }, [t, toggleLoader]);

  useEffect(() => {
    const session = getCurrentProjectLocal();
    if (!isAdminUser(session)) {
      history.replace('/history');
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      u =>
        u.nome.toLowerCase().includes(term) ||
        u.login.toLowerCase().includes(term),
    );
  }, [users, search]);

  const handleToggleAdmin = async (user: FranqueadoUser, next: boolean) => {
    if (updatingId != null) return;

    if (
      !next &&
      currentUser?.franqId != null &&
      currentUser.franqId === user.id
    ) {
      toast.error(t('users.selfDemoteError'));
      return;
    }

    setUpdatingId(user.id);
    try {
      const { data } = await setAdmin(user.id, next);
      if (!data?.success) {
        throw new Error(data?.message || 'failed');
      }
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, isAdmin: next } : u)),
      );
      toast.success(
        next ? t('users.promoteSuccess') : t('users.demoteSuccess'),
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || t('users.updateError'),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExit = () => {
    cleanProjectLocal();
    history.push('/login');
  };

  if (!isAdminUser(currentUser)) {
    return null;
  }

  return (
    <>
      <S.PageHeader>
        <S.Logo src={LogoCleanCheck} alt="CleanCheck logotipo" />
        <S.HeaderActions>
          <S.HeaderButton type="button" onClick={() => history.push('/history')}>
            <MdHistory />
            <Translator path="users.backToHistory" />
          </S.HeaderButton>
          <S.HeaderButton type="button" onClick={handleExit}>
            <FiLogOut />
            <Translator path="filter.exit" />
          </S.HeaderButton>
        </S.HeaderActions>
      </S.PageHeader>

      <S.Container>
        <S.Title>
          <Translator path="users.title" />
        </S.Title>
        <S.Subtitle>
          <Translator path="users.subtitle" />
        </S.Subtitle>

        <S.SearchInput
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('users.searchPlaceholder')}
        />

        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        {filteredUsers.length === 0 && !error ? (
          <S.EmptyMessage>
            <Translator path="users.empty" />
          </S.EmptyMessage>
        ) : (
          <S.Table>
            <S.TableHead>
              <S.TableRow>
                <S.TableHeader>
                  <Translator path="users.colName" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="users.colLogin" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="users.colType" />
                </S.TableHeader>
                <S.TableHeader>
                  <Translator path="users.colAdmin" />
                </S.TableHeader>
              </S.TableRow>
            </S.TableHead>
            <S.TableBody>
              {filteredUsers.map(user => (
                <S.TableRow key={user.id}>
                  <S.TableCell>{user.nome}</S.TableCell>
                  <S.TableCell>{user.login}</S.TableCell>
                  <S.TableCell>
                    <S.RoleBadge $admin={user.isAdmin}>
                      {user.isAdmin
                        ? t('users.roleAdmin')
                        : t('users.roleFranqueado')}
                    </S.RoleBadge>
                  </S.TableCell>
                  <S.TableCell>
                    <S.ToggleLabel>
                      <S.ToggleInput
                        type="checkbox"
                        checked={user.isAdmin}
                        disabled={updatingId === user.id}
                        onChange={e =>
                          handleToggleAdmin(user, e.target.checked)
                        }
                      />
                      <Translator path="users.adminToggle" />
                    </S.ToggleLabel>
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

export default Users;
