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
import { ChangeEvent, useState, useCallback } from 'react';
import clsx from 'clsx';

import { GROUPS, GRADES, GENDERS } from 'config/consts';
import { useAppDispatch } from 'store';
import { showSnackbar } from 'store/component';

import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import type { NextPage } from 'next';

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

enum SelectKeys {
  sex = 'sex', // 性别
  group = 'group', // 组别
  grade = 'grade', // 年级
}
type SelectData = {
  [key in SelectKeys]?: unknown;
};

const Edit: NextPage = () => {
  const data: any = {};
  const dispatch = useAppDispatch();
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // popover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const [file, setFile] = useState<File | null>(null);
  const [selectValue, setSelectValue] = useState<SelectData>({});

  const handleSelect = useCallback(
    (id: SelectKeys) => (e: ChangeEvent<{ name?: string; value: unknown }>) => {
      setSelectValue((prev) => ({ ...prev, [id]: e.target.value }));
    },
    [],
  );

  const handleFile = useCallback(({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
    if (!files) {
      return dispatch(showSnackbar({ message: '你没有上传任何文件', type: 'warning' }));
    }
    const file = files[0];
    if (file.size > 1024 * 1024 * 100) {
      return dispatch(showSnackbar({ message: '文件大小必须小于100MB', type: 'warning' }));
    }

    setFile(file);
  }, []);

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
        <Grid container justify='space-evenly' direction='row'>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <TextField
              required
              label='姓名'
              variant='outlined'
              className={classes.input}
              defaultValue={data.name || ''}
            />
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <TextField
              required
              label='邮箱'
              variant='outlined'
              className={classes.input}
              defaultValue={data.email || ''}
            />
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <TextField
              required
              label='推荐人'
              variant='outlined'
              className={classes.input}
              defaultValue={data.recommend || '无'}
            />
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <TextField
              required
              label='电话'
              className={classes.input}
              variant='outlined'
              defaultValue={data.phone || ''}
            />
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            {/* TODO: Autocomplete */}
            <TextField
              required
              label='学院'
              className={classes.input}
              variant='outlined'
              defaultValue={data.institude || ''}
            />
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            {/* TODO: Autocomplete */}
            <TextField
              required
              label='专业'
              className={classes.input}
              variant='outlined'
              defaultValue={data.institude || ''}
            />
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <FormControl className={clsx(classes.input, classes.select)}>
              <FormHelperText>性别</FormHelperText>
              <NativeSelect variant='outlined' value={selectValue.sex} onChange={handleSelect(SelectKeys.sex)}>
                {GENDERS.map((gender) => (
                  <option value={gender} key={gender}>
                    {gender}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <FormControl className={clsx(classes.input, classes.select)}>
              <FormHelperText>所属年级</FormHelperText>
              <NativeSelect variant='outlined' value={selectValue.grade} onChange={handleSelect(SelectKeys.grade)}>
                {GRADES.map((grade) => (
                  <option value={grade} key={grade}>
                    {grade}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <FormControl className={clsx(classes.input, classes.select)}>
              <FormHelperText>组别</FormHelperText>
              <NativeSelect variant='outlined' value={selectValue.group} onChange={handleSelect(SelectKeys.group)}>
                {GROUPS.map((group) => (
                  <option value={group} key={group}>
                    {group}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item className={clsx(classes.item, classes.center)} {...grid}>
            <FormControlLabel
              className={classes.center}
              control={<Switch inputProps={{ name: 'isQuick' }} size='small' />}
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
            <Button variant='outlined' component='label'>
              上传建立/作品集
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
              defaultValue={data.intro || ''}
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Edit;
