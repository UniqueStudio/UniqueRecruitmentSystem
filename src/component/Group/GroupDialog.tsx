import React, { PureComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Verify from '../../container/Verify';
import Button from '@material-ui/core/Button';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from '../../style/withRoot';
import styles from '../../style/group';

interface Props extends WithStyles {
    dialogOpen: boolean;
    toggleDialog: () => void;
    handleInput: (event: React.ChangeEvent) => void;
    code: string;
    sendInterview: () => void;
}

class GroupDialog extends PureComponent<Props> {
    render() {
        const { dialogOpen, toggleDialog, sendInterview, classes, code, handleInput } = this.props;

        return (
            <Dialog open={dialogOpen} onClose={toggleDialog}>
                <div className={classes.dialog}>
                    <Verify onChange={handleInput} code={code} />
                    <div className={classes.buttonContainer}>
                        <Button color='primary' variant='contained' className={classes.button}
                                onClick={sendInterview}>确认发送</Button>
                        <Button color='primary' className={classes.button}
                                onClick={toggleDialog}>取消</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(GroupDialog));