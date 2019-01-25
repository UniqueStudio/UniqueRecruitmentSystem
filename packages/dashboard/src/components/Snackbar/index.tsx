import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { SnackbarProvider } from 'notistack';

import styles from 'Styles/snackbar';

class Snackbar extends PureComponent<WithStyles> {

    render() {
        const { children, classes } = this.props;
        return (
            <SnackbarProvider maxSnack={5} classes={{
                variantSuccess: classes.success,
                variantError: classes.error,
                variantWarning: classes.warning,
                variantInfo: classes.info,
            }}>
                <>
                    {children}
                </>
            </SnackbarProvider>
        );
    }
}

export default withStyles(styles)(Snackbar);
