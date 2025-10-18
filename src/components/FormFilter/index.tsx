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
import IconExit from '../../assets/iconExit.svg';
import MenuIcon from '../../assets/menuIconBlue.svg';
import { ReactI18NextChild, useTranslation } from 'react-i18next';
import * as ProjectService from '../../services/projectService';
import { useHistory } from 'react-router-dom';
import { Combo, Input, Option } from './styles';
import useDeviceDimensions from '../../hooks/useDevice';
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
    status: ''
  },
  employees = [],
  departments = [],
  ...props
}) => {
  const [fields, setFields] = useState(formFieldsState);
  const history = useHistory();
  const menuRef = useRef<HTMLInputElement>();
  const { t } = useTranslation();
  const { idProjeto, nome } = ProjectService.getCurrentProjectLocal();
  function handleSubmit() {
    onSubmit(fields);
  }
  function handleChangeFields(fieldName: string, value: string) {
    setFields({ ...fields, [fieldName]: value });
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
            <Combo
              name="project"
              placeholder="Projeto"
              value={idProjeto}
              disabled={true}
            >
              <Option value={idProjeto} defaultValue={idProjeto}>
                {nome}
              </Option>
            </Combo>
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
              <Combo
                name="department"
                placeholder="Departamento"
                value={fields.department}
                onChange={e => handleChangeFields('department', e.target.value)}
              >
                {departments.map((department: string, index: number) => (
                  <Option key={`department-${index}`} value={index !==0 ? department : ''}>
                    {department}
                  </Option>
                ))}
              </Combo>
            ) : (
              <Input
                type="text"
                onChange={e => handleChangeFields('department', e.target.value)}
                name="department"
                placeholder={t('filter.department')}
                value={fields.department}
              />
            )}
          </Row>
          <Row flexColumn>
            {employees.length ? (
              <Combo
                name="employee"
                placeholder="Funcionário"
                value={fields.employee}
                onChange={e => handleChangeFields('employee', e.target.value)}
              >
                {employees.map((employee: string, index: number) => (
                  <Option key={`employee-${index}`} value={index !== 0 ? employee : ''}>
                    {employee}
                  </Option>
                ))}
              </Combo>
            ) : (
              <Input
                type="text"
                onChange={e => handleChangeFields('employee', e.target.value)}
                name="employee"
                placeholder={t('filter.employee')}
                value={fields.employee}
              />
            )}
          </Row>
          <Row flexColumn>
            <Combo
              name="status"
              placeholder="Status"
              value={fields.status}
              onChange={e => handleChangeFields('status', e.target.value)}
            >
              {statusFilterOptions.map(({ value, label }, index) => (
                <Option key={index} value={value} defaultValue={''}>
                  {label}
                </Option>
              ))}
            </Combo>
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
