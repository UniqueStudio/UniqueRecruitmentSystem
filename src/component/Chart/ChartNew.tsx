import * as React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { Add as AddIcon } from '@material-ui/icons'

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import Modal from '../Modal';

interface Props extends WithStyles {
    toggleSnackbarOn: (info: string) => void;
    launchRecruitment: (info: object) => void;
}

class ChartNew extends React.PureComponent<Props> {
    state = {
        modalOpen: false,
        year: '',
        type: '',
        start: new Date().toISOString().slice(0, 10),
        end: new Date().toISOString().slice(0, 10)
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({
            [name]: e.target['value']
        })
    };

    launchRecruitment = () => {
        const info = { ...this.state };
        if (!info.year || !info.type) {
            this.props.toggleSnackbarOn('请完整填写信息！');
            return;
        }
        info['title'] = info.year + info.type;
        info['startTime'] = +new Date(info.start);
        info['endTime'] = +new Date(info.end);
        if (info['startTime'] >= info['endTime']) {
            this.props.toggleSnackbarOn('结束时间必须大于开始时间！');
            return;
        }
        this.props.launchRecruitment({ title: info['title'], start: info['startTime'], end: info['endTime'] });
    };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.chart}>
                <Tooltip title="发起招新" classes={{ tooltip: classes.tooltip }}>
                    <IconButton
                        className={classes.newButton}
                        classes={{ root: classes.newButtonRoot }}
                        onClick={this.toggleModalOpen}
                    >
                        <AddIcon color='primary' className={classes.newIcon} />
                    </IconButton>
                </Tooltip>
                <Modal title="发起招新"
                       open={this.state.modalOpen}
                       onClose={this.toggleModalOpen}
                >
                    <div className={classes.newContainer}>
                        <span>
                            <TextField
                                select
                                label="选择年份"
                                className={classes.select}
                                value={this.state.year}
                                onChange={this.handleChange('year')}
                                margin="normal"
                            >
                                {[...new Array(5)].map((i, j) => (
                                    <MenuItem key={j} value={j + new Date().getFullYear()}>
                                        {j + new Date().getFullYear()}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="选择类型"
                                className={classes.select}
                                value={this.state.type}
                                onChange={this.handleChange('type')}
                                margin="normal"
                            >
                                {[['春招', 'S'], ['夏令营', 'C'], ['秋招', 'A']].map(i => (
                                    <MenuItem key={i[1]} value={i[1]}>
                                        {i[0]}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </span>
                        <TextField
                            label="开始时间"
                            type="date"
                            defaultValue={this.state.start}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.picker}
                            onChange={this.handleChange('start')}
                        />
                        <TextField
                            label="结束时间"
                            type="date"
                            defaultValue={this.state.end}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.picker}
                            onChange={this.handleChange('end')}
                        />
                        <Button color='primary' variant='contained' onClick={this.launchRecruitment}>确定</Button>
                    </div>
                </Modal>
            </Paper>
        )
    }
}

export default withRoot(withStyles(styles)(ChartNew));
