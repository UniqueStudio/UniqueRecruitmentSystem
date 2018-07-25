import * as React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import withRoot from "../../style/withRoot";
import styles from "../../style";
import Modal from '../Modal';

interface Props extends WithStyles {
    loggedIn: boolean;
    login: (username: string) => void;
}

class Login extends React.PureComponent<Props> {
    state = {
        modal: true,
        name: ''
    };

    login = () => {
        this.props.login(this.state.name);
        sessionStorage.setItem('username', this.state.name);
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({
            name: event.target['value'],
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <Modal open={!this.props.loggedIn} title='登录'>
                <div className={classes.login}>
                    <TextField
                        label="用户名"
                        value={this.state.name}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <div>微信接口</div>
                    <Button color="primary" size="large" onClick={this.login}
                            disabled={this.state.name === ''}>登录</Button>
                </div>
            </Modal>
        );
    }
}

export default withRoot(withStyles(styles)(Login));
