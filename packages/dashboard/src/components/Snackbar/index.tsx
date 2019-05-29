import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';
import { SnackbarProvider } from 'notistack';

import styles from '../../styles/snackbar';

class Snackbar extends PureComponent<WithStyles<typeof styles>> {

    render() {
        const { children, classes } = this.props;
        return (
            <SnackbarProvider
                maxSnack={5}
                classes={{
                    variantSuccess: classes.success,
                    variantError: classes.error,
                    variantWarning: classes.warning,
                    variantInfo: classes.info,
                }}
            >
                <>
                    {children}
                </>
            </SnackbarProvider>
        );
    }
}

export default withStyles(styles)(Snackbar);
