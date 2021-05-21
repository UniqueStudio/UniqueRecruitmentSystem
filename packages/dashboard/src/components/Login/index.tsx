import { Button, ButtonGroup, TextField } from '@material-ui/core';
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

    const handleMethod = (newMethod: number) => () => setMethod(newMethod);

    const handlePassword: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => setPassword(value);

    const handlePhone: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => setPhone(value);

    const ChooseMethod = (
        <ButtonGroup orientation='vertical' variant='text' size='large'>
            <Button onClick={handleMethod(2)}>账号密码登录</Button>
            <Button onClick={handleMethod(1)}>企业微信登录</Button>
        </ButtonGroup>
    );
    const ByQRCode = (
        <>
            {$user.qrCodeURL && <img className={classes.qrCode} src={$user.qrCodeURL} alt='QRCode' />}
            <ButtonGroup variant='outlined' size='large'>
                <Button onClick={loginByQRCode} disabled={!!$user.qrCodeURL}>获取二维码</Button>
                <Button onClick={handleMethod(0)}>返回</Button>
            </ButtonGroup>
        </>
    );
    const ByPassword = (
        <>
            <TextField label='手机号' value={phone} autoComplete='tel-national' onChange={handlePhone} />
            <TextField
                label='密码'
                value={password}
                type='password'
                autoComplete='current-password'
                onChange={handlePassword}
            />
            <ButtonGroup variant='outlined' size='large'>
                <Button type='submit' disabled={!phone || !password}>登录</Button>
                <Button onClick={handleMethod(0)}>返回</Button>
            </ButtonGroup>
        </>
    );
    return (
        <div className={classes.background}>
            <img src={logo} className={classes.logoImage} alt='UNIQUE STUDIO' />
            <Modal open title='登录' hideBackdrop>
                <div className={classes.container}>
                    <form className={classes.form} onSubmit={handleLogin}>
                        {[ChooseMethod, ByQRCode, ByPassword][method]}
                    </form>
                </div>
            </Modal>
            {$component.progressOn && <Progress />}
        </div>
    );
});
