import * as React from "react";
import Button from '@material-ui/core/Button';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import withRoot from "../../style/withRoot";
import styles from "../../style";
import Modal from '../Modal';

interface Props extends WithStyles {
    loggedIn: boolean;
    login: (username: string) => void;
}

class Login extends React.Component<Props> {
    state = {
        modal: true
    };

    login = () => {
        this.props.login('AA');
    };

    render() {
        const { classes } = this.props;
        return (
            <Modal open={!this.props.loggedIn} title='登录'>
                <div className={classes.login}>
                    <div>微信接口</div>
                    <Button color="primary" size="large" onClick={this.login}>登录</Button>
                </div>
            </Modal>
        );
    }
}

export default withRoot(withStyles(styles)(Login));
