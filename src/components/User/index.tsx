import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { OptionsObject } from 'notistack';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import { GENDERS, GROUPS, GROUPS_ } from '../../config/consts';
import { User as UserType } from '../../config/types';
import styles from '../../styles/user';
import { titleConverter } from '../../utils/titleConverter';

interface Props extends WithStyles<typeof styles> {
    userInfo: UserType;
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
    submitInfo: (info: { phone: string, mail: string, password?: string }) => void;
}

class User extends PureComponent<Props> {
    state = {
        phone: '',
        mail: '',
        password: undefined
    };

    handleChange = (name: string) => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [name]: value,
        });
    };

    checkMail = (mail: string) => {
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
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
        const password = this.state.password;
        if (!this.state.mail && !this.state.phone && !password) {
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
        this.props.submitInfo({ phone, mail, password });
    };

    render() {
        const { classes, userInfo } = this.props;
        const { username, gender, group, isAdmin, isCaptain, phone, mail, joinTime } = userInfo;
        if (!username) {
            return null;
        }
        const textFields = [
            { label: '姓名', value: username },
            { label: '性别', value: GENDERS[gender] },
            { label: '组别', value: GROUPS[GROUPS_.indexOf(group)] },
            { label: '加入时间', value: titleConverter(joinTime) },
            { label: '组长?', value: isCaptain ? '是' : '否' },
            { label: '管理员?', value: isAdmin ? '是' : '否' },
        ];
        const editableFields = [
            { label: '手机号', defaultValue: phone, name: 'phone' },
            { label: '邮箱', defaultValue: mail, name: 'mail' },
        ];
        return (
            <form>
                <Paper className={classes.container}>
                    <div className={classes.title}>
                        <Typography variant='h6'>
                            我的信息
                        </Typography>
                    </div>
                    {textFields.map(({ label, value }, index) =>
                        <TextField
                            label={label}
                            value={value}
                            margin='normal'
                            className={classes.userInfo}
                            disabled
                            key={index}
                        />
                    )}
                    {editableFields.map(({ label, defaultValue, name }, index) =>
                        <TextField
                            label={label}
                            defaultValue={defaultValue}
                            onChange={this.handleChange(name)}
                            margin='normal'
                            className={classes.userInfo}
                            key={index}
                            autoComplete='off'
                        />
                    )}
                    <TextField
                        label='密码'
                        onChange={this.handleChange('password')}
                        type='password'
                        margin='normal'
                        className={classes.userInfo}
                        autoComplete='new-password'
                    />
                    <div>
                        <Button size='large' onClick={this.submitChange} color='primary'>修改</Button>
                    </div>
                </Paper>
            </form>
        );
    }
}

export default withStyles(styles)(User);
