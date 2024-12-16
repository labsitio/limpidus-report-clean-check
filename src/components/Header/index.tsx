import React, { useState } from 'react';
import * as S from './styles';
import LogoCleanCheck from '../../assets/cleanCheckLogo.svg';
import MenuIcon from '../../assets/menuIcon.svg';
import FormFilter from '../FormFilter';
import { FaDownload } from "react-icons/fa";


const Header = (props: any) => {
  const {
    onSubmit = () => {},
    formFieldsState = {},
    setFormFieldsState = () => {},
    buttonExport = false,
    onExport = () => {},
  } = props;
  const [opened, setOpened] = useState<boolean>(true);
  const [closeChange, setCloseChange] = useState<boolean>(false);
  const handleStop = () => {
    setOpened(false);
    setCloseChange(!closeChange);
  };

  return (
    <>
      <S.Container>
        <div />
        <S.Logo src={LogoCleanCheck} alt="CleanCheck logotipo" />
        <S.GroupButton>
          {buttonExport && (
            <S.ButtonExport onClick={() => {onExport()}}>
              <FaDownload />
              Exportar
            </S.ButtonExport>
          )}
          <S.MenuButton onClick={() => setOpened(true)}>
            <S.MenuButtonImage src={MenuIcon} alt="Icone de menu" />
          </S.MenuButton>
        </S.GroupButton>
        <FormFilter
          opened={opened}
          handleClose={handleStop}
          onSubmit={onSubmit}
          formFieldsState={formFieldsState}
          setFormFieldsState={setFormFieldsState}
        />
      </S.Container>
    </>
  );
};

export default Header;
