import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/user';

import { GROUPS, GROUPS_, User as UserType } from '../../lib/const';

interface Props extends WithStyles {
    uid: string;
    info: UserType;
    fetchInfo: (uid: string) => void;
    submitInfo: (uid: string, info: object) => void;
    toggleSnackbar: (info: string, color: string) => void;
}

interface State {
    info: UserType;
}

class User extends PureComponent<Props> {

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (prevState.info !== nextProps.info && !prevState.info.sex) {
            return {
                info: nextProps.info,
            };
        }
        return null;
    }

    state: State = {
        info: this.props.info,
    };

    componentDidMount() {
        const { fetchInfo, uid } = this.props;
        uid && fetchInfo(uid);
    }

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        const info = { ...this.state.info };
        info[name] = name === 'isCaptain' || name === 'isAdmin' ? Boolean(event.target['value']) : event.target['value'];
        this.setState({
            info,
        });
    };

    checkMail = (mail: string) => {
        const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return re.test(mail);
    };

    checkPhone = (phone: string) => {
        const re = /^((13[0-9])|(14[57])|(15[0-3,5-9])|166|(17[035678])|(18[0-9])|(19[89]))\d{8}$/i;
        return re.test(phone);
    };
    submitChange = () => {
        const { info } = this.state;
        if (Object.values(info).includes('')) {
            this.props.toggleSnackbar('请完整填写信息', 'warning');
            return;
        }
        if (!this.checkMail(info.mail)) {
            this.props.toggleSnackbar('邮箱格式不正确', 'warning');
            return;
        }
        if (!this.checkPhone(info.phone)) {
            this.props.toggleSnackbar('手机号码格式不正确', 'warning');
            return;
        }
        this.props.submitInfo(this.props.uid, this.state.info);
    };

    render() {
        const { classes } = this.props;
        const { username, sex, group, isAdmin, isCaptain, phone, mail, joinTime } = this.state.info;
        const year = new Date().getFullYear();
        const years = [year - 3, year - 2, year - 1, year];
        const translator = [['春招', 'S'], ['夏令营', 'C'], ['秋招', 'A']];
        return sex !== undefined && (
            <Paper className={classes.container}>
                <TextField
                    label='姓名'
                    value={username}
                    onChange={this.handleChange('username')}
                    margin='normal'
                    className={classes.userInfo}
                    disabled={true}
                />
                <TextField
                    select
                    label='性别'
                    className={classes.userInfo}
                    value={sex}
                    onChange={this.handleChange('sex')}
                    margin='normal'
                >
                    <MenuItem value='Male'>男</MenuItem>
                    <MenuItem value='Female'>女</MenuItem>
                </TextField>
                <TextField
                    select
                    label='组别'
                    className={classes.userInfo}
                    value={group || ''}
                    onChange={this.handleChange('group')}
                    margin='normal'
                    disabled={true}
                >
                    {GROUPS.map((i, j) => <MenuItem value={GROUPS_[j]} key={j}>{i}</MenuItem>)}
                </TextField>
                <TextField
                    select
                    label='加入时间'
                    className={classes.userInfo}
                    value={joinTime || ''}
                    onChange={this.handleChange('joinTime')}
                    margin='normal'
                >
                    {years.map((i) => translator.map((j) => <MenuItem value={i + j[1]}>{i + j[0]}</MenuItem>))}
                </TextField>
                <TextField
                    select
                    label='组长?'
                    className={classes.userInfo}
                    value={isCaptain ? 1 : 0}
                    onChange={this.handleChange('isCaptain')}
                    margin='normal'
                    disabled={true}
                >
                    <MenuItem value={1}>是</MenuItem>
                    <MenuItem value={0}>否</MenuItem>
                </TextField>
                <TextField
                    select
                    label='管理员?'
                    className={classes.userInfo}
                    value={isAdmin ? 1 : 0}
                    onChange={this.handleChange('isAdmin')}
                    margin='normal'
                    disabled={true}
                >
                    <MenuItem value={1}>是</MenuItem>
                    <MenuItem value={0}>否</MenuItem>
                </TextField>
                <TextField
                    label='手机号'
                    value={phone || ''}
                    onChange={this.handleChange('phone')}
                    margin='normal'
                    className={classes.userInfo}
                />
                <TextField
                    label='邮箱'
                    value={mail || ''}
                    onChange={this.handleChange('mail')}
                    className={classes.userInfo}
                    margin='normal'
                />
                <div>
                    <Button size='large' onClick={this.submitChange} color='primary'>修改</Button>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(User);
