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
  makeStyles,
  NativeSelect,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { ChangeEvent, useState, useCallback } from 'react';
import { NextPage } from 'next';
import { GROUPS, GRADES, GENDERS } from 'config/consts';
import { useAppDispatch } from 'store';
import { showSnackbar } from 'store/component';

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <Typography variant='h4'>编辑信息</Typography>
        <Divider />
        <Grid container justify='space-evenly' direction='row'>
          <Grid item className={classes.item} {...grid}>
            <TextField
              required
              label='姓名'
              variant='outlined'
              className={classes.input}
              defaultValue={data.name || ''}
            />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            <TextField
              required
              label='邮箱'
              variant='outlined'
              className={classes.input}
              defaultValue={data.email || ''}
            />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            <TextField
              required
              label='推荐人'
              variant='outlined'
              className={classes.input}
              defaultValue={data.recommend || '无'}
            />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            <TextField
              required
              label='电话'
              className={classes.input}
              variant='outlined'
              defaultValue={data.phone || ''}
            />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            {/* TODO: Autocomplete */}
            <TextField
              required
              label='学院'
              className={classes.input}
              variant='outlined'
              defaultValue={data.institude || ''}
            />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            {/* TODO: Autocomplete */}
            <TextField
              required
              label='专业'
              className={classes.input}
              variant='outlined'
              defaultValue={data.institude || ''}
            />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            <FormControl className={classes.input}>
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
          <Grid item className={classes.item} {...grid}>
            <FormControl className={classes.input}>
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
          <Grid item className={classes.item} {...grid}>
            <FormControl className={classes.input}>
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
          <Grid item className={classes.item} {...grid}>
            <FormHelperText>快速通道</FormHelperText>
            <Switch inputProps={{ name: 'isQuick' }} />
          </Grid>
          <Grid item className={classes.item} {...grid}>
            <Button variant='outlined' component='label'>
              上传建立/作品集
              <input id='resume' name='resume' type='file' hidden onChange={handleFile} />
            </Button>
          </Grid>
          <Grid item className={classes.item} {...grid}>
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
