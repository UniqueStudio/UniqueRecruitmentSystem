import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { QR_CODE_URL } from '../../config/consts';
import logo from '../../images/logo.png';
import styles from '../../styles/login';

import Modal from '../Modal';
import Progress from '../Progress';

interface Props extends WithStyles<typeof styles> {
    loggedIn: boolean;
    isLoading: boolean;
    weChatKey: string;
    isScanning: boolean;
    getQRCode: () => void;
    login: (phone: string, password: string) => void;
}

class Login extends PureComponent<Props> {

    state = {
        src: '',
        method: 0,
        phone: '',
        password: ''
    };

    static getDerivedStateFromProps(nextProps: Props) {
        const { weChatKey } = nextProps;
        return {
            src: weChatKey ? `${QR_CODE_URL}${weChatKey}` : '',
        };
    }

    login = () => {
        const { phone, password } = this.state;
        this.props.login(phone, password);
    };

    setMethod = (method: 1 | 2) => () => {
        this.setState({
            method
        });
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target['value'],
        });
    };

    render() {
        const { classes, loggedIn, isScanning, getQRCode, isLoading } = this.props;
        const { src, method, phone, password } = this.state;
        return (
            !loggedIn ? <div className={classes.container}>
                <img src={logo} className={classes.logoImage} alt='UNIQUE STUDIO' />
                <Modal open title='登录' hideBackdrop>
                    <div className={classes.login}>
                        {method === 0 ? <>
                            <Button color='primary' size='large' onClick={this.setMethod(1)}>企业微信登录</Button>
                            <Button color='primary' size='large' onClick={this.setMethod(2)}>账号密码登录</Button>
                        </> : method === 1 ? <>
                            {src && <img src={src} alt='This is QRCode' />}
                            <Button color='primary' size='large' onClick={getQRCode} disabled={isScanning}>获取二维码</Button>
                            <Button color='primary' size='large' onClick={this.setMethod(2)}>账号密码登录</Button>
                        </> : method === 2 ? <>
                            <TextField
                                label='手机号'
                                value={phone}
                                onChange={this.handleChange('phone')}
                                margin='normal'
                            />
                            <TextField
                                label='密码'
                                value={password}
                                type='password'
                                onChange={this.handleChange('password')}
                                margin='normal'
                            />
                            <Button color='primary' size='large' onClick={this.login} disabled={!phone || !password}>登录</Button>
                            <Button color='primary' size='large' onClick={this.setMethod(1)}>企业微信登录</Button>
                        </> : null}
                    </div>
                </Modal>
                {isLoading && <Progress />}
            </div> : <Redirect to='/' />
        );
    }
}

export default withStyles(styles)(Login);
