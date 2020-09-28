import React, { ChangeEventHandler, FC, memo, useState } from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { GENDERS, GROUPS, GROUPS_ } from '../../config/consts';

import { Props } from '../../containers/User';

import useStyles from '../../styles/user';

import { titleConverter } from '../../utils/titleConverter';

const User: FC<Props> = memo(({ userInfo, enqueueSnackbar, submitInfo }) => {
    const { username, gender, group, isAdmin, isCaptain, phone: phoneP, mail: mailP, joinTime } = userInfo;
    const classes = useStyles();
    const [data, setData] = useState({
        phone: phoneP,
        mail: mailP,
        password: '',
    });

    if (!username) {
        return null;
    }

    const { mail, password, phone } = data;

    const handleChange = (name: string): ChangeEventHandler<HTMLInputElement> => ({ target: { value } }) => {
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const checkMail = (value: string) => {
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return re.test(value);
    };

    const checkPhone = (value: string) => {
        const re = /^1[3-9]\d{9}$/i;
        return re.test(value);
    };

    const submitChange = () => {
        if (mail === mailP && phone === phoneP && !password) {
            enqueueSnackbar('你没有做任何更改！', { variant: 'info' });
            return;
        }
        if (!checkMail(mail)) {
            enqueueSnackbar('邮箱格式不正确！', { variant: 'warning' });
            return;
        }
        if (!checkPhone(phone)) {
            enqueueSnackbar('手机号码格式不正确！', { variant: 'warning' });
            return;
        }
        submitInfo({ phone, mail, password });
    };

    const textFields = [
        { label: '姓名', value: username },
        { label: '性别', value: GENDERS[gender] },
        { label: '组别', value: GROUPS[GROUPS_.indexOf(group)] },
        { label: '加入时间', value: titleConverter(joinTime) },
        { label: '组长?', value: isCaptain ? '是' : '否' },
        { label: '管理员?', value: isAdmin ? '是' : '否' },
    ];
    const editableFields = [
        { label: '手机号', value: phone, name: 'phone', autoComplete: 'tel-national' },
        { label: '邮箱', value: mail, name: 'mail', autoComplete: 'email' },
        { label: '密码', value: password, name: 'password', autoComplete: 'new-password', type: 'password' },
    ];
    return (
        <form>
            <Paper className={classes.container}>
                <div className={classes.title}>
                    <Typography variant='h6'>我的信息</Typography>
                </div>
                {textFields.map((props, index) => (
                    <TextField margin='normal' className={classes.userInfo} disabled key={index} {...props} />
                ))}
                {editableFields.map(({ name, ...otherProps }, index) => (
                    <TextField
                        onChange={handleChange(name)}
                        margin='normal'
                        className={classes.userInfo}
                        key={index}
                        {...otherProps}
                    />
                ))}
                <div>
                    <Button size='large' onClick={submitChange} color='primary'>
                        修改
                    </Button>
                </div>
            </Paper>
        </form>
    );
});

export default User;
