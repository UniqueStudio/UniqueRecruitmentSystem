import {
  Card,
  Container,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChangeEvent, FC, useState, useCallback } from 'react';
import clsx from 'clsx';

interface Props {
  data: Record<string, string>;
}

const useStyle = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    padding: theme.spacing(2),
  },
  input: {
    width: theme.spacing(20),
    margin: theme.spacing(2),
  },
  short: {
    width: theme.spacing(10),
  },
  long: {
    [theme.breakpoints.down(520)]: {
      width: theme.spacing(30),
    },
    [theme.breakpoints.between(520, 600)]: {
      width: theme.spacing(20),
    },
    [theme.breakpoints.up(600)]: {
      width: theme.spacing(40),
    },
  },
}));

const Edit: FC<Props> = ({ data }) => {
  const classes = useStyle();
  const [sex, setSex] = useState<unknown>(data.sex);

  const handleSelectSex = useCallback((e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value } = e.target;
    setSex(value);
  }, []);

  return (
    <Card className={classes.card}>
      <Typography variant='h4'>编辑信息</Typography>
      <Divider />
      <Grid container justify='space-evenly' direction='row'>
        <Grid item>
          <TextField
            required
            label='姓名'
            variant='outlined'
            className={classes.input}
            defaultValue={data.name || ''}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label='邮箱'
            variant='outlined'
            className={clsx(classes.input, classes.long)}
            defaultValue={data.email || ''}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            label='推荐人'
            variant='outlined'
            className={classes.input}
            defaultValue={data.recommend || '无'}
          />
        </Grid>
        <Grid item>
          <Select
            native
            autoWidth
            variant='outlined'
            value={sex}
            onChange={handleSelectSex}
            className={clsx(classes.input, classes.short)}
          >
            <option aria-label='None' value='0'>
              未知
            </option>
            <option value='1'>男</option>
            <option value='2'>女</option>
          </Select>
        </Grid>
        <Grid item>
          <TextField className={classes.input} variant='outlined' required />
        </Grid>
        <Grid item>
          <TextField className={classes.input} variant='outlined' required />
        </Grid>
      </Grid>
    </Card>
  );
};

export default Edit;
