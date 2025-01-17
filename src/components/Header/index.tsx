import React, { useState } from 'react';
import * as S from './styles';
import LogoCleanCheck from '../../assets/cleanCheckLogo.svg';
import MenuIcon from '../../assets/menuIcon.svg';
import FormFilter from '../FormFilter';
import { FaDownload } from 'react-icons/fa';
import useDeviceDimensions from '../../hooks/useDevice';
import { ButtonExit, IconExit as IE } from '../Menu/styles';
import Translator from '../Translator';
import { FiLogOut } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import * as ProjectService from '../../services/projectService';

const Header = (props: any) => {
  const {
    onSubmit = () => {},
    formFieldsState = {},
    setFormFieldsState = () => {},
    buttonExport = false,
    onExport = () => {},
    isDesktop = false,
  } = props;
  const [opened, setOpened] = useState<boolean>(true);
  const [closeChange, setCloseChange] = useState<boolean>(false);
  const history = useHistory();
  const handleStop = () => {
    setOpened(false);
    setCloseChange(!closeChange);
  };

  const handleExit = () => {
    ProjectService.cleanProjectLocal();
    history.push('/login');
  };

  return (
    <>
      <S.Container>
        <S.Logo src={LogoCleanCheck} alt="CleanCheck logotipo" />
        <S.GroupButton>
          {buttonExport && (
            <S.ButtonExport
              onClick={() => {
                onExport();
              }}
            >
              <FaDownload />
              Exportar
            </S.ButtonExport>
          )}
          {!isDesktop && (
            <S.MenuButton onClick={() => setOpened(true)}>
              <S.MenuButtonImage src={MenuIcon} alt="Icone de menu" />
            </S.MenuButton>
          )}

          {isDesktop && (
            <ButtonExit className="desktop" onClick={handleExit}>
              <FiLogOut />
              <S.TextExit><Translator path="filter.exit" /></S.TextExit>
            </ButtonExit>
          )}
        </S.GroupButton>
        {!isDesktop && (
          <FormFilter
            opened={opened}
            handleClose={handleStop}
            onSubmit={onSubmit}
            formFieldsState={formFieldsState}
            setFormFieldsState={setFormFieldsState}
            isDesktop={isDesktop}
          />
        )}
      </S.Container>
    </>
  );
};

export default Header;
