import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { InjectedNotistackProps } from 'notistack';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GENDERS, GROUPS, GROUPS_ } from 'Config/consts';
import { User as UserType } from 'Config/types';
import styles from 'Styles/user';
import { titleConverter } from 'Utils/titleConverter';

interface Props extends WithStyles {
    userInfo: UserType;
    enqueueSnackbar: InjectedNotistackProps['enqueueSnackbar'];
    submitInfo: (info: { phone: string, mail: string }) => void;
}

class User extends PureComponent<Props> {
    state = {
        phone: '',
        mail: ''
    };

    handleChange = (name: string) => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [name]: value,
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
        const { userInfo, enqueueSnackbar } = this.props;
        const mail = this.state.mail || userInfo.mail;
        const phone = this.state.phone || userInfo.phone;
        if (!this.state.mail && !this.state.phone) {
            enqueueSnackbar('你没有做任何更改！', { variant: 'info' });
            return;
        }
        if (!this.checkMail(mail)) {
            enqueueSnackbar('邮箱格式不正确！', { variant: 'warning' });
            return;
        }
        if (!this.checkPhone(phone)) {
            enqueueSnackbar('手机号码格式不正确！', { variant: 'warning' });
            return;
        }
        this.props.submitInfo({ phone, mail });
    };

    render() {
        const { classes, userInfo } = this.props;
        const { username, gender, group, isAdmin, isCaptain, phone, mail, joinTime } = userInfo;
        if (!username) {
            return null;
        }
        return (
            <Paper className={classes.container}>
                <div className={classes.title}>
                    <Typography variant='h6'>
                        我的信息
                    </Typography>
                </div>
                <TextField
                    label='姓名'
                    value={username}
                    margin='normal'
                    className={classes.userInfo}
                    disabled
                />
                <TextField
                    label='性别'
                    className={classes.userInfo}
                    value={GENDERS[gender]}
                    margin='normal'
                    disabled
                />
                <TextField
                    label='组别'
                    className={classes.userInfo}
                    value={GROUPS[GROUPS_.indexOf(group)]}
                    margin='normal'
                    disabled
                />
                <TextField
                    label='加入时间'
                    className={classes.userInfo}
                    value={titleConverter(joinTime)}
                    margin='normal'
                    disabled
                />
                <TextField
                    label='组长?'
                    className={classes.userInfo}
                    value={isCaptain ? '是' : '否'}
                    margin='normal'
                    disabled
                />
                <TextField
                    label='管理员?'
                    className={classes.userInfo}
                    value={isAdmin ? '是' : '否'}
                    margin='normal'
                    disabled
                />
                <TextField
                    label='手机号'
                    defaultValue={phone}
                    onChange={this.handleChange('phone')}
                    margin='normal'
                    className={classes.userInfo}
                />
                <TextField
                    label='邮箱'
                    defaultValue={mail}
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
