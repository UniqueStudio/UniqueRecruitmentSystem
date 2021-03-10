import {
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  GridSize,
  IconButton,
  NativeSelect,
  Switch,
  TextField,
  Typography,
  Popover,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HelpOutline } from '@material-ui/icons';
import { ChangeEvent, FormEventHandler, useState, useCallback, useMemo, useEffect } from 'react';
import clsx from 'clsx';

import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import type { NextPage } from 'next';
import type { CandidateForm } from 'config/types';

import AutoComplete from 'components/AutoComplete';
import { GROUPS, GRADES, GENDERS, RANKS } from 'config/consts';
import { useAppDispatch, useAppSelector } from 'store';
import { showSnackbar } from 'store/component';
import { fetchCandidate, setCandidateField } from 'store/candidate';
import { submitCandidateForm } from 'services';
import { Departments } from 'config/departments';

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
    width: '80%',
    padding: theme.spacing(2),
  },
  input: {
    margin: theme.spacing(2),
    width: theme.spacing(24),
  },
  select: {
    width: theme.spacing(12),
  },
  item: {
    minHeight: theme.spacing(10),
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const grid: Partial<Record<Breakpoint, boolean | GridSize>> = {
  xs: 12,
  sm: 6,
  md: 4,
};

type InputKeys = keyof CandidateForm;

const Edit: NextPage = () => {
  const dispatch = useAppDispatch();
  const classes = useStyle();
  const title = useAppSelector(({ recruitment }) => recruitment.title);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // popover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = useCallback(() => void setAnchorEl(null), []);

  const [resume, setResume] = useState<File | string>('');
  // all form value
  const inputValue = useAppSelector(({ candidate }) => candidate);

  // fetch candidate data
  useEffect(() => void dispatch(fetchCandidate()), [dispatch]);

  const handleInput = useCallback(
    (id: InputKeys) => (e: ChangeEvent<{ name?: string; value: CandidateForm[InputKeys] }>) =>
      void dispatch(setCandidateField({ key: id, value: e.target.value })),
    [dispatch],
  );

  // use `<T extends xxx>` to aviod conflict with jsx `<T>`
  // see: https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics
  const setField = useCallback(
    (key: InputKeys) => <T extends CandidateForm[InputKeys] | null>(_: unknown, value: T) =>
      void dispatch(setCandidateField({ key, value: value ?? '' })),
    [dispatch],
  );

  const handleFile = useCallback(
    ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
      if (!files) {
        return dispatch(showSnackbar({ message: '你没有上传任何文件', type: 'warning' }));
      }
      const resume = files[0];
      if (resume.size > 1024 * 1024 * 100) {
        return dispatch(showSnackbar({ message: '文件大小必须小于100MB', type: 'warning' }));
      }

      setResume(resume);
    },
    [dispatch],
  );

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    try {
      // TODO: use redux thunk to submit form
      const { type, message } = await submitCandidateForm({ ...inputValue, title, resume }, true);

      if (type !== 'success') {
        return dispatch(showSnackbar({ type, message }));
      }

      return dispatch(showSnackbar({ type: 'success', message: '修改成功' }));
    } catch (error) {
      dispatch(showSnackbar({ type: 'error', message: '网络错误' }));
    }
  };

  const Majors = useMemo(
    () => Departments[inputValue.institute as keyof typeof Departments] ?? Object.values(Departments).flat(),
    [inputValue.institute],
  );

  const popOpen = Boolean(anchorEl);

  const Pop = (
    <Popover
      id='quick-helper-popover'
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={popOpen}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      {/* TODO(colinaaa): intro to quick */}
      <Typography>所谓的快速通道 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Typography>
    </Popover>
  );

  return (
    <Container className={clsx(classes.root, classes.center)}>
      <Card className={classes.card}>
        <Typography variant='h4'>编辑信息</Typography>
        <Divider />
        <form onSubmit={handleSubmit}>
          <Grid container justify='space-evenly' direction='row'>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <TextField
                required
                label='姓名'
                variant='outlined'
                className={classes.input}
                value={inputValue.name || ''}
                onChange={handleInput('name')}
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <TextField
                required
                label='邮箱'
                variant='outlined'
                className={classes.input}
                value={inputValue.mail || ''}
                onChange={handleInput('mail')}
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <TextField
                label='推荐人'
                variant='outlined'
                className={classes.input}
                value={inputValue.referrer || ''}
                onChange={handleInput('referrer')}
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <TextField
                required
                label='电话'
                className={classes.input}
                variant='outlined'
                value={inputValue.phone || ''}
                onChange={handleInput('phone')}
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <AutoComplete
                label='学院'
                className={classes.input}
                options={Object.keys(Departments)}
                value={inputValue.institute}
                onChange={setField('institute')}
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <AutoComplete
                label='专业'
                className={classes.input}
                options={Majors}
                value={inputValue.major}
                onChange={setField('major')}
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <FormControl className={clsx(classes.input, classes.select)}>
                <FormHelperText>成绩排名</FormHelperText>
                <NativeSelect variant='outlined' value={inputValue.rank || 0} onChange={handleInput('rank')}>
                  {RANKS.map((rank, index) => (
                    <option value={index} key={rank}>
                      {rank}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <FormControl className={clsx(classes.input, classes.select)}>
                <FormHelperText>性别</FormHelperText>
                <NativeSelect variant='outlined' value={inputValue.gender || 0} onChange={handleInput('gender')}>
                  {GENDERS.map((gender, index) => (
                    <option value={index} key={gender}>
                      {gender}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <FormControl className={clsx(classes.input, classes.select)}>
                <FormHelperText>所属年级</FormHelperText>
                <NativeSelect variant='outlined' value={inputValue.grade || 0} onChange={handleInput('grade')}>
                  {GRADES.map((grade, index) => (
                    <option value={index} key={grade}>
                      {grade}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <FormControl className={clsx(classes.input, classes.select)}>
                <FormHelperText>组别</FormHelperText>
                <NativeSelect variant='outlined' value={inputValue.group || 'web'} onChange={handleInput('group')}>
                  {GROUPS.map((group) => (
                    <option value={group.toLowerCase()} key={group}>
                      {group}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <FormControlLabel
                className={classes.center}
                control={
                  <Switch
                    inputProps={{ name: 'isQuick' }}
                    size='small'
                    checked={inputValue.isQuick}
                    onChange={setField('isQuick')}
                  />
                }
                label={
                  <div className={classes.center}>
                    <span>快速通道</span>
                    <IconButton size='small' onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                      <HelpOutline fontSize='small' />
                    </IconButton>
                    {Pop}
                  </div>
                }
                labelPlacement='top'
              />
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <Button variant='contained' component='label' color='secondary'>
                上传简历/作品集
                <input id='resume' name='resume' type='file' hidden onChange={handleFile} />
              </Button>
            </Grid>
            <Grid item className={clsx(classes.item, classes.center)} {...grid}>
              <TextField
                required
                multiline
                rows={2}
                rowsMax={8}
                label='自我介绍'
                className={classes.input}
                variant='outlined'
                value={inputValue.intro || ''}
                onChange={handleInput('intro')}
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
      </Card>
    </Container>
  );
};

export default Edit;
