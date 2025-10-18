import React, { useEffect, useRef } from "react";
require("react-datepicker/dist/react-datepicker.css");
import { MdClose } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import * as S from "./styles";
import IconExit from "../../assets/iconExit.svg";
import Select from "../Select";
import Translator from "../Translator";
import * as ProjectService from "../../services/projectService";
import DatePicker from "../DatePicker";
import { useData } from "../../hooks/data";
import { addDays, isAfter, isBefore, subDays } from "date-fns";

type FormValues = {
  initialDate: string;
  finishDate: string;
  project: string;
  department: string;
  employee: string;
  status: string;
};

interface MenuProps {
  opened: boolean;
  changed: boolean;
  handleClose(): void;
}

interface OptionsIProps {
  title: string;
  value: string | number;
}

const Menu: React.FC<MenuProps> = ({ opened, handleClose }) => {
  const {
    departments,
    status,
    employees,
    getRequests,
    filterEmployee,
    filterDepartment,
    handleFilter,
    filterStatus,
  } = useData();

  const history = useHistory();
  const menuRef = useRef<HTMLInputElement>();
  const schema = Yup.object().shape({
    username: Yup.string().required('Usuário obrigatório'),
    password: Yup.string().required('Senha obrigatória'),
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    errors,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      initialDate: subDays(new Date(), 7).toISOString(),
      finishDate: new Date().toISOString(),
      project: '',
      department: '',
      employee: '',
      status: '',
    },
  });

  const statusField = useWatch({
    control,
    name: 'status',
  });

  const employee = useWatch({
    control,
    name: 'employee',
  });

  const initialDate : Date | undefined = useWatch({
    control,
    name: 'initialDate',
  });

  const finishDate : Date | undefined = useWatch({
    control,
    name: 'finishDate',
  });

  const department = useWatch({
    control,
    name: 'department',
  });

  const watchDepartment = watch('department');
  const watchEmployee = watch('employee');
  const watchStatus = watch('status');

  useEffect(() => {
    localStorage.removeItem('limpidusIdArea');
    localStorage.setItem("limpidusInitialDate", new Date(getValues('initialDate')).toISOString())
    localStorage.setItem("limpidusFinishDate", new Date(getValues('finishDate')).toISOString())
  }, [initialDate, finishDate]);

  useEffect(() => {
    if (isAfter(new Date(getValues('initialDate')), new Date(getValues('finishDate')))) {
      setValue('finishDate', addDays(initialDate?? new Date(), 1))
    }

    getRequests(
      new Date(getValues('initialDate')),
      new Date(getValues('finishDate')),
    );
  }, [initialDate]);

  useEffect(() => {
    if (isBefore(new Date(getValues('finishDate')), new Date(getValues('initialDate')))) {
      setValue('initialDate', subDays(finishDate ?? new Date(), 1))
    }

    getRequests(
      new Date(getValues('initialDate')),
      new Date(getValues('finishDate')),
    );
    setValue('department', '');
    setValue('employee', '');
    setValue('status', '');
  }, [finishDate]);

  useEffect(() => {
    const idArea = Number(getValues('department'));
    if (!idArea) return;

    localStorage.setItem('limpidusIdArea', String(idArea));

    setValue('employee', '');
    setValue('status', '');
    filterDepartment(idArea);
  }, [department]);

  useEffect(() => {
    const employeeSelected = getValues('employee');
    if (!employeeSelected) return;
    const idArea = Number(getValues('department'));

    filterEmployee(employeeSelected, idArea);
    setValue('status', '');
  }, [employee]);

  useEffect(() => {
    const statusSelected = getValues('status');
    if (!statusSelected) return;
    const idArea = Number(getValues('department'));
    const employeeSelected = getValues('employee');

    filterStatus(statusSelected, idArea, employeeSelected);
  }, [statusField]);

  const onSubmit = (data: FormValues) => {};

  const { t } = useTranslation();

  const getAllDepartmentsInputs = () => {
    const duplicatedInputs = departments.map(department => {
      return { title: department.nome, value: department.id };
    });

    return getSetArray(duplicatedInputs);
  };

  const getAllStatusInputs = () => {
    const duplicatedInputs = status.map(currentStatus => {
      return { title: currentStatus.descricao, value: currentStatus.idStatus };
    });

    return getSetArray(duplicatedInputs);
  };

  const getAllEmployeesInputs = () => {
    const duplicatedInputs = employees.map(employee => {
      return {
        title: `${employee.nome} ${employee.sobrenome}`,
        value: `${employee.nome}|${employee.sobrenome}`,
      };
    });

    return getSetArray(duplicatedInputs);
  };

  const getSetArray = (array: OptionsIProps[]) => {
    const set: OptionsIProps[] = [];

    array.map(elem => {
      let isUnique = true;
      set.forEach(uniqueElement => {
        if (uniqueElement.title === elem.title) {
          isUnique = false;
        }
      });
      if (isUnique) {
        set.push(elem);
      }
      return elem;
    });

    return set;
  };

  const handleExit = () => {
    ProjectService.cleanProjectLocal();
    history.push('/login');
  };

  return (
    <S.Container ref={menuRef} opened={opened}>
      <S.Header>
        <S.Title>
          <Translator path="filter.title" />
        </S.Title>
        <S.ButtonIcon onClick={handleClose}>
          <MdClose />
        </S.ButtonIcon>
      </S.Header>
      <S.Content>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.Row flexColumn>
            <S.Row justifySpaceBetween>
              <DatePicker
                name="initialDate"
                control={control}
                placeholder={t('filter.startDate')}
              />
              <DatePicker
                name="finishDate"
                control={control}
                placeholder={t('filter.endDate')}
              />
            </S.Row>
          </S.Row>
          <S.Row flexColumn>
            <Select
              name="department"
              placeholder={t('filter.department')}
              register={register}
              errors={errors}
              options={getAllDepartmentsInputs()}
            />
          </S.Row>
          <S.Row flexColumn>
            <Select
              name="employee"
              placeholder={t('filter.employee')}
              register={register}
              errors={errors}
              options={getAllEmployeesInputs()}
              disabled={!watchDepartment}
            />
          </S.Row>
          <S.Row flexColumn>
            <Select
              name="status"
              placeholder="Status"
              register={register}
              errors={errors}
              options={getAllStatusInputs()}
              disabled={!watchEmployee}
            />
          </S.Row>
        </S.Form>
        <S.Buttons>
          <S.Button onClick={() => handleFilter()}>
            <Translator path="filter.filter" />
          </S.Button>
          <S.ButtonExit onClick={handleExit}>
            <S.IconExit src={IconExit} alt="icon sair" />{' '}
            <Translator path="filter.exit" />
          </S.ButtonExit>
        </S.Buttons>
      </S.Content>
    </S.Container>
  );
};

export default Menu;
