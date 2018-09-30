import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/group';
import withRoot from '../../style/withRoot';

import Verify from '../../container/Verify';

import { Candidate } from '../../lib/const';

interface Props extends WithStyles {
    dialogOpen: boolean;
    toggleDialog: () => void;
    handleInput: (name: string) => (event: React.ChangeEvent) => void;
    code: string;
    place: string;
    sendInterview: (candidates: string[]) => () => void;
    candidates: Candidate[];
}

class GroupDialog extends PureComponent<Props> {
    state = {
        candidates: this.props.candidates,
    };

    handleDelete = (cid: string) => () => {
        this.setState({
            candidates: this.state.candidates.filter((i) => i._id !== cid),
        });
    };

    componentDidUpdate(prevProps: Props) {
        if (prevProps.candidates !== this.props.candidates && prevProps.place === this.props.place && prevProps.code === this.props.code) {
            this.setState({
                candidates: prevProps.candidates,
            });
        }
    }

    render() {
        const { dialogOpen, toggleDialog, sendInterview, classes, code, handleInput, place } = this.props;
        const { candidates } = this.state;

        return (
            <Dialog open={dialogOpen} onClose={toggleDialog}>
                <div className={classes.dialog}>
                    {
                        candidates.length ? candidates.map(
                            (i, j) => <Chip
                                key={j}
                                label={i.name}
                                className={classes.chip}
                                onDelete={candidates.length > 1 ? this.handleDelete(i._id) : undefined}
                                color='primary'
                            />) : <Typography align='center' variant='title'>没有满足条件的候选人</Typography>
                    }
                    <div className={classes.smsDetail}>
                        <Typography>{`{{姓名}}你好，请于{{时间}}在启明学院亮胜楼${place}参加{{群面/组面}}，请准时到场。`}</Typography>
                        <TextField
                            label='地点'
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
                            onClick={sendInterview(candidates.map((i) => i._id))}
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
