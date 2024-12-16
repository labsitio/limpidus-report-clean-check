import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import logoImg from '../../assets/cleanCheckNewLogo.png';
import * as ProjectService from '../../services/projectService';
import { useData } from '../../hooks/data';
import {
  BaseScreen,
  Input,
  Button,
  Translator,
  FooterLanguageSelect,
} from '../../components';
import * as S from './styles';

type FormValues = {
  username: string;
  password: string;
};

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { updateUser } = useData();
  const history = useHistory();
  const schema = Yup.object().shape({
    username: Yup.string().required('Usuário obrigatório'),
    password: Yup.string().required('Senha obrigatória'),
  });

  const { register, handleSubmit, errors, setValue } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {},
  });

  const onSubmit = async (form: FormValues) => {
    try {
      const { data } = await ProjectService.getProject(
        form.username,
        form.password,
      );
      if (!data) {
        throw new Error('user not found');
      }
      updateUser(data);
      history.push('/');
    } catch (error) {
      toast.error('Usuário não encontrado');
    }
  };

  return (
    <>
      <BaseScreen>
        <S.Container>
          <S.LogoContainer>
            <S.Logo src={logoImg} alt="Limpidus logotipo" />
          </S.LogoContainer>
          <S.Card>
            <S.Title>
              <Translator path="signIn.title" />
            </S.Title>
            <S.Subtitle>
              <Translator path="signIn.subTitle" />
            </S.Subtitle>
            <S.Form onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="username"
                placeholder={t('signIn.user')}
                register={register}
                errors={errors}
              />
              <Input
                name="password"
                register={register}
                type="password"
                placeholder={t('signIn.password')}
                errors={errors}
              />
              <Button type="submit">
                <Translator path="signIn.enter" />
              </Button>
            </S.Form>
          </S.Card>
        </S.Container>
      </BaseScreen>
      <FooterLanguageSelect />
    </>
  );
};

export default SignIn;
