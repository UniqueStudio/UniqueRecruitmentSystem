import React, { PureComponent } from 'react';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
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
    candidates: string[];
}

class GroupDialog extends PureComponent<Props> {
    render() {
        const { dialogOpen, toggleDialog, sendInterview, classes, code, handleInput, candidates } = this.props;

        return (
            <Dialog open={dialogOpen} onClose={toggleDialog}>
                <div className={classes.dialog}>
                    {candidates.length ? candidates.map((i, j) => <Chip key={j} label={i} />)
                        : <Typography align='center'>没有满足条件的候选人</Typography>}
                    <Verify onChange={handleInput} code={code} />
                    <div className={classes.buttonContainer}>
                        <Button
                            disabled={!candidates.length}
                            color='primary'
                            variant='contained'
                            className={classes.button}
                            onClick={sendInterview}
                        >确认发送</Button>
                        <Button color='primary' className={classes.button}
                                onClick={toggleDialog}>取消</Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default withRoot(withStyles(styles)(GroupDialog));