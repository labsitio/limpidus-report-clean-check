import React  from 'react';
import { useTranslation } from 'react-i18next';
import * as S from '../../components/Commons';
import {
  Header,
  AreaItem,
  FooterLanguageSelect,
} from '../../components';
import { useLoader } from '../../hooks/loader';
import { useData } from '../../hooks/data';

const Dashboard: React.FC = () => {
  const { currentAreas, user } = useData();
  const { loader } = useLoader();
  const { t } = useTranslation();
  return (
    <>
      <S.Container>
        <Header />
        <S.Content>
          {currentAreas.length > 0 && (
            <>
              <S.Title>{user.nome}</S.Title>
              {currentAreas.map((area, index) => (
                <AreaItem isFirst={index === 0} area={area} />
              ))}
            </>
          )}
          {currentAreas.length === 0 && !loader && (
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
export default Dashboard;
