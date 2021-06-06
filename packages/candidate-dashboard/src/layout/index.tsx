import { t, Trans } from '@lingui/macro';
import {
    AppBar,
    makeStyles,
    SwipeableDrawer,
    Toolbar,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
    List,
} from '@material-ui/core';
import { Home as HomeIcon, Menu as MenuIcon, Edit as EditIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';

import { ListItemLink } from 'components/ListItemLink';
import { useAppSelector } from 'store';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        display: 'flex',
        flexDirection: 'column',
        width: drawerWidth,
    },
    drawerheader: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        '& img': {
            width: '180px',
            margin: 'auto',
        },
        '& h6': {
            color: 'white',
            marginTop: theme.spacing(2),
        },
    },
    drawerList: {
        padding: theme.spacing(2, 1),
    },
    content: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
}));

const Layout: FC = (props) => {
    const theme = useTheme();
    const classes = useStyles();
    const matchMedia = useMediaQuery(theme.breakpoints.up('lg'));
    const title = useAppSelector((state) => state.component.layout.title);
    const [open, setOpen] = useState<boolean>(matchMedia);

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

  useEffect(() => {
    setOpen(matchMedia);
  }, [matchMedia]);
  return (
    <div className={classes.root}>
      <AppBar className={clsx(classes.appBar, { [classes.appBarShift]: open && matchMedia })}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor='left'
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        variant={matchMedia ? 'persistent' : 'temporary'}
      >
        <nav className={classes.drawer}>
          <header className={classes.drawerheader}>
            <img src='/assets/logo.png' />
            <Typography variant='h6' align='center'>
              <Trans>联创团队招新选手Dashboard</Trans>
            </Typography>
          </header>
          <List className={classes.drawerList}>
            <ListItemLink href='/' primary={t`首页`} icon={<HomeIcon />} onClick={handleClose} />
            <ListItemLink href='/edit' primary={t`编辑信息`} icon={<EditIcon />} onClick={handleClose} />
          </List>
        </nav>
      </SwipeableDrawer>
      <Toolbar /> {/** fix offset **/}
      <main className={clsx(classes.content, { [classes.contentShift]: open && matchMedia })}>{props.children}</main>
    </div>
  );
};

export default Layout;
