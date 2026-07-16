import React, { FC, useEffect, useRef, useState } from 'react';
import * as S from '../Commons';
import Translator from '../Translator';
import {
  Button,
  ButtonExit,
  ButtonIcon,
  Buttons,
  Container,
  Content,
  Form,
  Header,
  Row,
} from '../Menu/styles';
import { useTranslation } from 'react-i18next';
import * as ProjectService from '../../services/projectService';
import { useHistory } from 'react-router-dom';
import {
  Combo,
  ComboLabel,
  ComboWrapper,
  Input,
  Label,
  Option,
} from './styles';
import { MdClose } from 'react-icons/md';

export interface IFormFilterResolve {
  project: { name: string; id: number };
  initialDate: string;
  finishDate: string;
  department: string;
  employee: string;
  status: string;
}
interface IFormFilterProps {
  opened: boolean;
  isDesktop: boolean;
  handleClose?: () => void;
  formFieldsState?: IFormFilterResolve;
  onSubmit: (fields: IFormFilterResolve) => void;
  setFormFieldsState?: (fields: IFormFilterResolve) => void;
  employees?: Array<string>;
  departments?: Array<string>;
}

const statusFilterOptions = [
  { value: 'false', label: 'Não Realizado' },
  { value: 'true', label: 'Concluido' },
  { value: '', label: 'Todos' },
];
const FormFilter: FC<IFormFilterProps> = ({
  opened,
  handleClose,
  onSubmit,
  setFormFieldsState = () => {},
  isDesktop = false,
  formFieldsState = {
    project: { name: '', id: 0 },
    initialDate: new Date().toISOString().split('T')[0],
    finishDate: new Date().toISOString().split('T')[0],
    department: '',
    employee: '',
    status: '',
  },
  employees = [],
  departments = [],
}) => {
  const [fields, setFields] = useState(formFieldsState);
  const history = useHistory();
  const menuRef = useRef<HTMLInputElement>();
  const { t } = useTranslation();
  const currentUser = ProjectService.getCurrentProjectLocal();
  const idProjeto = currentUser?.idProjeto ?? 0;
  const nome = currentUser?.nome ?? '';
  const allowedProjects = currentUser?.allowedProjects ?? [];
  const isFranqueado = ProjectService.isFranqueadoUser(currentUser);
  const canSwitchProject =
    ProjectService.isAdminUser(currentUser) || allowedProjects.length > 1;
  const projectOptions =
    allowedProjects.length > 0
      ? allowedProjects
      : idProjeto
        ? [{ id: idProjeto, name: nome }]
        : [];

  useEffect(() => {
    if (idProjeto && nome) {
      setFields(prevFields => ({
        ...prevFields,
        project: { id: idProjeto, name: nome },
      }));
    }
  }, [idProjeto, nome]);

  useEffect(() => {
    if (isFranqueado && fields.status !== 'true') {
      setFields(prevFields => ({
        ...prevFields,
        status: 'true',
      }));
    }
  }, [isFranqueado, fields.status]);

  function handleSubmit() {
    onSubmit(fields);
  }
  function handleChangeFields(fieldName: string, value: string) {
    setFields({ ...fields, [fieldName]: value });
  }

  function handleProjectChange(projectIdStr: string) {
    const projectId = Number(projectIdStr);
    const selected = projectOptions.find(p => p.id === projectId);
    if (!selected) return;
    ProjectService.selectProject(selected.id, selected.name);
    setFields(prev => ({
      ...prev,
      project: { id: selected.id, name: selected.name },
      department: '',
      employee: '',
    }));
  }

  const handleExit = () => {
    ProjectService.cleanProjectLocal();
    history.push('/login');
  };

  useEffect(() => {
    setFormFieldsState(fields);
  }, [fields]);

  return (
    <Container ref={menuRef} opened={opened}>
      <Header>
        <S.Title>
          <Translator path="filter.title" />
        </S.Title>
        {handleClose && (
          <ButtonIcon onClick={handleClose}>
            <MdClose />
          </ButtonIcon>
        )}
      </Header>
      <Content>
        <Form onSubmit={() => handleSubmit()}>
          <Row flexColumn>
            <ComboWrapper>
              <Combo
                name="project"
                placeholder={t('filter.project')}
                value={fields.project?.id || idProjeto}
                disabled={!canSwitchProject}
                onChange={e => handleProjectChange(e.target.value)}
              >
                {projectOptions.map(project => (
                  <Option key={project.id} value={project.id}>
                    {project.name}
                  </Option>
                ))}
              </Combo>
              <ComboLabel>{t('filter.project')}</ComboLabel>
            </ComboWrapper>
          </Row>
          <Row flexColumn>
            <Row justifySpaceBetween>
              <Input
                type="date"
                onChange={e =>
                  handleChangeFields('initialDate', e.target.value)
                }
                name="initialDate"
                placeholder={t('filter.startDate')}
                value={fields.initialDate}
              />
              <Input
                type="date"
                onChange={e => handleChangeFields('finishDate', e.target.value)}
                name="finishDate"
                placeholder={t('filter.finishDate')}
                value={fields.finishDate}
              />
            </Row>
          </Row>
          <Row flexColumn>
            {departments.length ? (
              <ComboWrapper>
                <Combo
                  name="department"
                  placeholder={t('filter.department')}
                  value={fields.department}
                  onChange={e =>
                    handleChangeFields('department', e.target.value)
                  }
                >
                  {departments.map((department: string, index: number) => (
                    <Option
                      key={`department-${index}`}
                      value={index !== 0 ? department : ''}
                    >
                      {department}
                    </Option>
                  ))}
                </Combo>
                <ComboLabel>{t('filter.department')}</ComboLabel>
              </ComboWrapper>
            ) : (
              <>
                <Label>{t('filter.department')}</Label>
                <Input
                  type="text"
                  onChange={e =>
                    handleChangeFields('department', e.target.value)
                  }
                  name="department"
                  placeholder={t('filter.department')}
                  value={fields.department}
                />
              </>
            )}
          </Row>
          <Row flexColumn>
            {employees.length ? (
              <ComboWrapper>
                <Combo
                  name="employee"
                  placeholder={t('filter.employee')}
                  value={fields.employee}
                  onChange={e => handleChangeFields('employee', e.target.value)}
                >
                  {employees.map((employee: string, index: number) => (
                    <Option
                      key={`employee-${index}`}
                      value={index !== 0 ? employee : ''}
                    >
                      {employee}
                    </Option>
                  ))}
                </Combo>
                <ComboLabel>{t('filter.employee')}</ComboLabel>
              </ComboWrapper>
            ) : (
              <>
                <Label>{t('filter.employee')}</Label>
                <Input
                  type="text"
                  onChange={e => handleChangeFields('employee', e.target.value)}
                  name="employee"
                  placeholder={t('filter.employee')}
                  value={fields.employee}
                />
              </>
            )}
          </Row>
          <Row flexColumn>
            <ComboWrapper>
              <Combo
                name="status"
                placeholder={t('filter.status')}
                value={fields.status}
                onChange={e => handleChangeFields('status', e.target.value)}
              >
                {(isFranqueado
                  ? statusFilterOptions.filter(({ value }) => value === 'true')
                  : statusFilterOptions
                ).map(({ value, label }, index) => (
                  <Option key={index} value={value} defaultValue={''}>
                    {label}
                  </Option>
                ))}
              </Combo>
              <ComboLabel>{t('filter.status')}</ComboLabel>
            </ComboWrapper>
          </Row>
        </Form>
        <Buttons>
          <Button onClick={() => handleSubmit()}>
            <Translator path="filter.filter" />
          </Button>
          {!isDesktop && (
            <ButtonExit onClick={handleExit}>
              <MdClose />
              <Translator path="filter.exit" />
            </ButtonExit>
          )}
        </Buttons>
      </Content>
    </Container>
  );
};

export default FormFilter;
