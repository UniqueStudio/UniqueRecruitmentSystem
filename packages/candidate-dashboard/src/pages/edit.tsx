/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Container, Grid, GridSize, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';

import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import type { NextPage } from 'next';
import type { CandidateForm } from '@uniqs/api';
import { Departments, GROUPS, GRADES, GENDERS, RANKS } from '@uniqs/config';

import AutoComplete, { MajorAutoComplete } from 'components/AutoComplete';
import { Input } from 'components/Input';
import { IsQuickSwitch } from 'components/IsQuickSwitch';
import { useAppDispatch, useAppSelector } from 'store';
import { setLayoutTitle } from 'store/component';
import { fetchCandidate, updateCandidate } from 'store/candidate';

const useStyle = makeStyles((theme) => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  root: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  input: {
    margin: theme.spacing(2),
    width: theme.spacing(24),
  },
  intro: {
    width: '100%',
  },
  item: {
    minHeight: theme.spacing(10),
  },
}));

const grid: Partial<Record<Breakpoint, boolean | GridSize>> = {
  xs: 12,
  sm: 6,
  md: 4,
};

type InputKeys = keyof CandidateForm;

interface InputField {
  name: InputKeys;
  label: string;
  required?: boolean;
}

const TextInputs: ReadonlyArray<InputField> = [
  { name: 'name', label: '姓名', required: true },
  { name: 'mail', label: '邮箱', required: true },
  { name: 'referrer', label: '推荐人' },
  { name: 'phone', label: '电话', required: true },
] as const;

const SelectInputs: ReadonlyArray<InputField & { options: ReadonlyArray<string> }> = [
  { name: 'rank', label: '成绩排名', required: true, options: RANKS },
  { name: 'gender', label: '性别', required: true, options: GENDERS },
  { name: 'grade', label: '所属年级', required: true, options: GRADES },
  { name: 'group', label: '组别', required: true, options: GROUPS },
] as const;

const Edit: NextPage = () => {
  const dispatch = useAppDispatch();
  const classes = useStyle();

  const {
    abandoned,
    rejected,
    interviewAllocations,
    interviewSelections,
    updatedAt,
    id,
    step,
    ...defaultValues
  } = useAppSelector(({ candidate }) => candidate);
  const methods = useForm({ defaultValues });

  // fetch candidate data
  useEffect(() => void dispatch(fetchCandidate()), [dispatch]);

  // title
  useEffect(() => void dispatch(setLayoutTitle('编辑信息')), [dispatch]);

  const handleSubmit = (data: CandidateForm) => {
    dispatch(updateCandidate(data));
  };

  // AutoComplete options
  const Deps = useMemo(() => Object.keys(Departments), []);

  return (
    <Container className={clsx(classes.root, classes.center)}>
      <Card className={classes.card}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Grid container justify='space-evenly' direction='row'>
              {TextInputs.map(({ label, name, required }, index) => (
                <Grid item className={clsx(classes.item, classes.center)} key={index} {...grid}>
                  <Input label={label} name={name} required={required} type='text' />
                </Grid>
              ))}
              <Grid item className={clsx(classes.item, classes.center)} {...grid}>
                <AutoComplete name='institute' label='学院' required className={classes.input} options={Deps} />
              </Grid>
              <Grid item className={clsx(classes.item, classes.center)} {...grid}>
                <MajorAutoComplete className={classes.input} />
              </Grid>
              {SelectInputs.map(({ label, name, required, options }, index) => (
                <Grid item className={clsx(classes.item, classes.center)} key={index} {...grid}>
                  <Input name={name} label={label} required={required} type='select'>
                    {options.map((opt, index) => (
                      <option value={index} key={opt}>
                        {opt}
                      </option>
                    ))}
                  </Input>
                </Grid>
              ))}
              <Grid item className={clsx(classes.item, classes.center)} {...grid}>
                <IsQuickSwitch />
              </Grid>
              <Grid item className={clsx(classes.item, classes.center)} {...grid}>
                <Input name='resume' label='上传简历/作品集' type='file' />
              </Grid>
              <Grid item className={clsx(classes.item, classes.center)} xs={12}>
                <Controller
                  name='intro'
                  render={({ field: { ref, ...props } }) => (
                    <TextField
                      {...props}
                      required
                      multiline
                      rows={4}
                      rowsMax={8}
                      inputRef={ref}
                      label='自我介绍'
                      className={clsx(classes.input, classes.intro)}
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container justify='space-evenly'>
              <Grid item>
                <Button variant='contained' color='primary' type='submit'>
                  保存
                </Button>
              </Grid>
              <Grid item>
                <Button variant='contained'>取消</Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Card>
    </Container>
  );
};

export default Edit;
