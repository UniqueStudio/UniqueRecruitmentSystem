import {
  Chip,
  createStyles,
  Grid,
  List,
  ListItem,
  makeStyles,
  Theme
} from '@material-ui/core';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Header from './Header';
import Modal from './Modal';

import { SelectDate } from './date';
import { ToggleSnackbar } from './index';
import { ClickedArray, initialState, reducer } from './reducer';

import { URL } from '../../config/const';

interface StyleProps {
  color?: 'white' | 'rgba(0, 0, 0, 0.26)' | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    chipWrapper: {
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: theme.spacing(1)
    },
    dateChip: {
      color: 'white',
      width: '40%'
    },
    chip: (props: StyleProps) => ({
      color: props.color,
      width: '80%'
    })
  })
);

interface TimesProps {
  isMobile: boolean;
}

type Dispatch = React.Dispatch<number>;
interface ContextProps {
  dispatch: Dispatch;
  clicked: ClickedArray;
}

const TimeDispatch = React.createContext<ContextProps>({} as ContextProps);

export default (props: TimesProps): React.ReactElement => {
  const classes = useStyles({ color: 'white' });
  const { snackbar } = useContext(ToggleSnackbar);

  const hash = window.location.pathname.slice(1); // get rid of "/"
  const [dates, setDates] = useState([] as SelectDate[]);
  const [step, setStep] = useState(''); // 'group' / 'team'

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const resp = await fetch(`${URL}/candidate/form/${hash}`);
        const data = await resp.json();

        if (data.type !== 'success') {
          snackbar('获取表单出了问题，请尝试重新加载', data.type);
        }

        sessionStorage.setItem('token', data.token);
        setDates(data.time);
        setStep(data.step);
      } catch {
        snackbar('获取表单出了问题，请尝试重新加载', 'error');
      }
    };

    fetchDates();
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

  if (!dates) {
    return <div>Loading</div>;
  }
  return (
    <TimeDispatch.Provider
      value={{
        dispatch,
        clicked: state.clicked
      }}
    >
      <List className={classes.root} subheader={<Header />}>
        {dates.map((item, line) => (
          <OneDay
            key={line}
            date={item}
            line={line}
            isMobile={props.isMobile}
            clicked={state.clicked}
          />
        ))}
      </List>
      <Modal clicked={state.clicked} hash={hash} step={step} dates={dates} />
    </TimeDispatch.Provider>
  );
};

interface OneDayProps {
  line: number;
  date: SelectDate;
  isMobile: boolean;
  clicked: ClickedArray;
}
const getDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const OneDay = (props: OneDayProps): React.ReactElement => {
  const classes = useStyles({ color: 'white' });
  return (
    <ListItem>
      <Grid container direction={'row'}>
        <Grid item xs={props.isMobile ? 12 : 4} className={classes.chipWrapper}>
          <Chip
            color={'primary'}
            label={getDate(props.date.date)}
            className={classes.dateChip}
            clickable={false}
          />
        </Grid>
        {['上午', '下午', '晚上'].map((time, column) => (
          <Grid
            item
            key={column}
            xs={props.isMobile ? 4 : 2}
            className={classes.chipWrapper}
          >
            <TimeChip
              label={time}
              disabled={
                !props.date[['morning', 'afternoon', 'evening'][column]]
              }
              index={props.line * 3 + column}
            />
          </Grid>
        ))}
      </Grid>
    </ListItem>
  );
};

interface ChipProps {
  label: string;
  disabled?: boolean;
  index: number;
}

const TimeChip = (props: ChipProps): React.ReactElement => {
  const white = useStyles({ color: 'white' });
  const classes = useStyles({});
  const gray = useStyles({ color: 'rgba(0, 0, 0, 0.26)' });
  const { dispatch, clicked } = useContext(TimeDispatch);
  const handleClick = () => {
    dispatch(props.index);
  };
  if (props.disabled) {
    return (
      <Chip
        color={'default'}
        variant={'default'}
        label={props.label}
        clickable={false}
        className={gray.chip}
      />
    );
  } else {
    return (
      <Chip
        color={'primary'}
        variant={clicked[props.index] ? 'default' : 'outlined'}
        label={props.label}
        clickable={true}
        className={
          clicked[props.index]
            ? white.chip
            : classes.chip
        }
        onClick={handleClick}
      />
    );
  }
};
