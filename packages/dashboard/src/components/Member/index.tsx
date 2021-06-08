import { Button, TextField } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import { setMyInfo } from '@apis/rest';
import { GENDERS, GROUP_MAP } from '@config/consts';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/member';
import { titleConverter } from '@utils/titleConverter';

export const Member: FC = observer(() => {
    const { $member, $component } = useStores();
    const { name, gender, group, isAdmin, isCaptain, phone: phoneP, mail: mailP, joinTime } = $member.info;
    const classes = useStyles();
    const [data, setData] = useState({
        phone: phoneP,
        mail: mailP || '',
        password: '',
    });

    if (!name) {
        return null;
    }

    const { mail, password, phone } = data;

    const handleChange =
        (name: string): ChangeEventHandler<HTMLInputElement> =>
        ({ target: { value } }) =>
            setData((prevData) => ({ ...prevData, [name]: value }));

    const checkMail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

    const checkPhone = (value: string) => /^1[3-9]\d{9}$/i.test(value);

    const submitChange = () => {
        if (mail === mailP && phone === phoneP && !password) {
            $component.enqueueSnackbar('你没有做任何更改', 'info');
            return;
        }
        if (!checkMail(mail)) {
            $component.enqueueSnackbar('邮箱格式不正确', 'warning');
            return;
        }
        if (!checkPhone(phone)) {
            $component.enqueueSnackbar('手机号码格式不正确', 'warning');
            return;
        }
        return setMyInfo({ phone, mail, password });
    };

    const textFields = [
        { label: '姓名', value: name },
        { label: '性别', value: GENDERS[gender] },
        { label: '组别', value: GROUP_MAP.get(group) },
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
        <form className={classes.container}>
            <div className={classes.textFieldContainer}>
                {textFields.map((props, index) => (
                    <TextField variant='standard' margin='normal' disabled key={index} {...props} />
                ))}
                {editableFields.map(({ name, ...otherProps }, index) => (
                    <TextField
                        variant='standard'
                        onChange={handleChange(name)}
                        margin='normal'
                        key={index}
                        {...otherProps}
                    />
                ))}
            </div>
            <Button size='large' onClick={submitChange}>
                修改
            </Button>
        </form>
    );
});
