import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { SnackbarProvider } from 'notistack';
import React, { FC } from 'react';

import { useStores } from '@hooks/useStores';
import useStyles from '@styles/snackbar';

const Snackbar: FC = observer(({ children }) => {
    const { $component } = useStores();
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
            className={clsx(classes.snackBar, { [classes.shrink]: $component.fabOn !== -1 && isMobile })}>
            <>{children}</>
        </SnackbarProvider>
    );
});

export default Snackbar;
