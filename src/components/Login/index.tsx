import React, { ChangeEventHandler, FC, FormEventHandler, memo, useState } from 'react';
import { Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Modal from '../Modal';
import Progress from '../Progress';

import { QR_CODE_URL } from '../../config/consts';

import { Props } from '../../containers/Login';

import logo from '../../images/logo.png';

import useStyles from '../../styles/login';

const Login: FC<Props> = memo(({ loggedIn, isScanning, getQRCode, isLoading, weChatKey, login }) => {
    const classes = useStyles();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [method, setMethod] = useState(0);
    if (loggedIn) {
        return <Redirect to='/' />;
    }
    const handleLogin: FormEventHandler = (event) => {
        // use preventDefault to disable HTML form's auto redirect
        event.preventDefault();
        login(phone, password);
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
            {weChatKey && <img src={`${QR_CODE_URL}${weChatKey}`} alt='This is QRCode' />}
            <Button
                className={classes.button}
                variant='contained'
                color='default'
                size='large'
                onClick={getQRCode}
                disabled={isScanning}>
                获取二维码
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
            <Button variant='contained' color='default' size='large' type='submit' disabled={!phone || !password}>
                登录
            </Button>
            <Button variant='contained' color='primary' size='large' onClick={handleMethod(1)}>
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
            {isLoading && <Progress />}
        </div>
    );
});

export default Login;
