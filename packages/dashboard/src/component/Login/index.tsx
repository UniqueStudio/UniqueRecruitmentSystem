import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import withRoot from "../../style/withRoot";
import styles from "../../style/login";
import Modal from '../Modal';
import { QR_CODE_URL } from '../../lib/const';

interface Props extends WithStyles {
    loggedIn: boolean;
    //login: (username: string) => void;
    getQRCode: () => void;
    weChatKey: string;
    buttonAble: boolean;
}

class Login extends PureComponent<Props> {
    state = {
        //modal: true,
        //name: '',
        src: ''
    };
    login = () => {
        //this.props.login(this.state.name);
        this.props.getQRCode();
    };

    static getDerivedStateFromProps(nextProps: Props) {
        if (nextProps.weChatKey) {
            return {
                src: `${QR_CODE_URL}${nextProps.weChatKey}`
            };
        }
        return {
            src: ''
        };
    }

    // handleChange = (event: React.ChangeEvent) => {
    //     this.setState({
    //         name: event.target['value'],
    //     });
    // };

    render() {
        const { classes, loggedIn, buttonAble } = this.props;
        return (
            <Modal open={!loggedIn} title='登录'>
                <div className={classes.login}>
                    {/*<TextField*/}
                    {/*label="用户名"*/}
                    {/*value={this.state.name}*/}
                    {/*onChange={this.handleChange}*/}
                    {/*margin="normal"*/}
                    {/*/>*/}
                    <img src={this.state.src} />
                    <Button color="primary" size="large" onClick={this.login} disabled={!buttonAble}>获取二维码</Button>
                </div>
            </Modal>
        );
    }
}

export default withRoot(withStyles(styles)(Login));
