import React, { PureComponent } from 'react';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Verify from '../../container/Verify';
import Button from '@material-ui/core/Button';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from '../../style/withRoot';
import styles from '../../style/group';

interface Props extends WithStyles {
    dialogOpen: boolean;
    toggleDialog: () => void;
    handleInput: (name: string) => (event: React.ChangeEvent) => void;
    code: string;
    place: string;
    sendInterview: () => void;
    candidates: string[];
}

class GroupDialog extends PureComponent<Props> {
    render() {
        const { dialogOpen, toggleDialog, sendInterview, classes, code, handleInput, candidates, place } = this.props;

        return (
            <Dialog open={dialogOpen} onClose={toggleDialog}>
                <div className={classes.dialog}>
                    {candidates.length ? candidates.map((i, j) => <Chip key={j} label={i} className={classes.chip}/>)
                        : <Typography align='center'>没有满足条件的候选人</Typography>}
                    <div className={classes.smsDetail}>
                        <Typography>{`{{姓名}}你好，请于{{时间}}在启明学院亮胜楼${place}参加{{群面/组面}}，请准时到场。`}</Typography>
                        <TextField
                            label="地点"
                            value={place}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleInput('place')}
                            className={classes.placeInput}
                        />
                    </div>
                    <Verify onChange={handleInput('code')} code={code}/>
                    <div className={classes.buttonContainer}>
                        <Button
                            disabled={!(candidates.length && code && place)}
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