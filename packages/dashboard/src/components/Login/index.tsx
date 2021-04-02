import { Button, TextField } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, FormEventHandler, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { loginByPassword, loginByQRCode } from '@apis/rest';
import { Modal } from '@components/Modal';
import { Progress } from '@components/Progress';
import { useStores } from '@hooks/useStores';
import logo from '@images/logo.png';
import useStyles from '@styles/login';

export const Login: FC = observer(() => {
    const { $user, $component } = useStores();

    const classes = useStyles();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [method, setMethod] = useState(0);
    if ($user.token) {
        return <Redirect to='/' />;
    }
    const handleLogin: FormEventHandler = (event) => {
        // use preventDefault to disable HTML form's auto redirect
        event.preventDefault();
        return loginByPassword(phone, password);
    };

    const handleMethod = (newMethod: number) => () => {
        setMethod(newMethod);
    };

    const handlePassword: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setPassword(value);
    };

    const handlePhone: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setPhone(value);
    };

    const ChooseMethod = (
        <>
            <Button
                className={classes.button}
                variant='contained'
                color='default'
                size='large'
                onClick={handleMethod(1)}>
                企业微信登录
            </Button>
            <Button
                className={classes.button}
                variant='contained'
                color='primary'
                size='large'
                onClick={handleMethod(2)}>
                账号密码登录
            </Button>
        </>
    );
    const ByQRCode = (
        <>
            {$user.qrCodeURL && <img className={classes.qrCode} src={$user.qrCodeURL} alt='QRCode' />}
            <Button
                className={classes.button}
                variant='contained'
                color='primary'
                size='large'
                onClick={loginByQRCode}
                disabled={!!$user.qrCodeURL}>
                获取二维码
            </Button>
            <Button
                className={classes.button}
                variant='contained'
                color='default'
                size='large'
                onClick={handleMethod(2)}>
                账号密码登录
            </Button>
        </>
    );
    const ByPassword = (
        <>
            <TextField
                label='手机号'
                className={classes.textField}
                value={phone}
                autoComplete='tel-national'
                onChange={handlePhone}
                margin='normal'
            />
            <TextField
                label='密码'
                className={classes.textField}
                value={password}
                type='password'
                autoComplete='current-password'
                onChange={handlePassword}
                margin='normal'
            />
            <Button
                className={classes.button}
                variant='contained'
                color='primary'
                size='large'
                type='submit'
                disabled={!phone || !password}>
                登录
            </Button>
            <Button
                className={classes.button}
                variant='contained'
                color='default'
                size='large'
                onClick={handleMethod(1)}>
                企业微信登录
            </Button>
        </>
    );
    return (
        <div className={classes.container}>
            <img src={logo} className={classes.logoImage} alt='UNIQUE STUDIO' />
            <Modal open title='登录' hideBackdrop>
                <form className={classes.login} onSubmit={handleLogin}>
                    {[ChooseMethod, ByQRCode, ByPassword][method]}
                </form>
            </Modal>
            {$component.progressOn && <Progress />}
        </div>
    );
});
