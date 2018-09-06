import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import AddIcon from '@material-ui/icons/Add';

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import Modal from '../Modal';
import Verify from '../../container/Verify';

interface Props extends WithStyles {
    disabled: boolean;
    status: string;
    toggleSnackbarOn: (info: string) => void;
    launchRecruitment: (info: object) => void;
    fetchData: () => void;
}

interface State {
    modalOpen: boolean;
    year: string;
    type: string;
    begin: string;
    end: string;
    code: string;
    launched: boolean;
}

class ChartNew extends PureComponent<Props> {
    state = {
        modalOpen: false,
        year: '',
        type: '',
        begin: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
        end: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
        code: '',
        launched: false
    };
    launchRecruitment = () => {
        const info = { ...this.state };
        if (!info.year || !info.type || !info.code || !info.begin || !info.end) {
            this.props.toggleSnackbarOn('请完整填写信息！');
            return;
        }
        info['title'] = info.year + info.type;
        info['beginTime'] = +new Date(info.begin);
        info['endTime'] = +new Date(info.end);
        if (info['beginTime'] >= info['endTime']) {
            this.props.toggleSnackbarOn('结束时间必须大于开始时间！');
            return;
        }
        this.props.launchRecruitment({
            title: info['title'],
            begin: info['beginTime'],
            end: info['endTime'],
            code: info.code
        });
        this.setState({
            launched: true
        })
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleChange = (name: string) => (e: React.ChangeEvent) => {
        this.setState({
            [name]: e.target['value']
        })
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.status === 'success' && prevState.launched) {
            nextProps.fetchData();
            return {
                modalOpen: false,
                code: '',
                launched: false
            };
        }
        return null;
    }

    render() {
        const { classes, disabled } = this.props;
        const { code } = this.state;
        return (
            <>
                <Tooltip title={disabled ? "只有组长能发起招新" : "发起招新"} classes={{ tooltip: classes.tooltip }} placement='top'>
                    <Paper className={classes.chart}>
                        <IconButton
                            className={classes.newButton}
                            classes={{ root: classes.newButtonRoot }}
                            onClick={this.toggleModalOpen}
                            disabled={disabled}
                        >
                            <AddIcon color='primary' className={classes.newIcon} />
                        </IconButton>
                    </Paper>
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
                                label="开始时间"
                                type="date"
                                defaultValue={this.state.begin}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className={classes.picker}
                                onChange={this.handleChange('begin')}
                            />
                        </span>
                        <span>
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
                        </span>
                        <Verify onChange={this.handleChange('code')} code={code} />
                        <Button color='primary' variant='contained' onClick={this.launchRecruitment}>确定</Button>
                    </div>
                </Modal>
            </>
        )
    }
}

export default withRoot(withStyles(styles)(ChartNew));
