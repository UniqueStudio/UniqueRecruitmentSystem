import React, { FC, memo } from 'react';

import classNames from 'classnames';

import { SnackbarProvider } from 'notistack';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

import { Props } from '../../containers/Snackbar';

import useStyles from '../../styles/snackbar';

const Snackbar: FC<Props> = memo(({ children, fabOn }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    return (
        <SnackbarProvider
            maxSnack={5}
            classes={{
                variantSuccess: classes.success,
                variantError: classes.error,
                variantWarning: classes.warning,
                variantInfo: classes.info,
            }}
            autoHideDuration={3000}
            className={classNames(classes.snackBar, { [classes.shrink]: fabOn !== -1 && isMobile })}
        >
            <>
                {children}
            </>
        </SnackbarProvider>
    );
});

export default Snackbar;
