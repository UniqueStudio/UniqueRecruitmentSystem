import React, { PureComponent } from "react";
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    onChange: (event: React.ChangeEvent) => void;
    getVerifyCode: () => void;
}

class Index extends PureComponent<Props> {

    state = {
        sent: false,
        time: 0
    };

    interval = null as any;

    getCode = () => {
        this.props.getVerifyCode();
        this.setState({
            sent: true,
            time: 60
        });
        this.interval = setInterval(() => {
            if (this.state.time === 0) {
                this.setState({
                    sent: false,
                });
                clearInterval(this.interval);
                return;
            }
            this.setState({
                time: this.state.time - 1
            });
        }, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { classes, onChange } = this.props;

        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
                <Button color='primary' onClick={this.getCode}
                        disabled={this.state.sent}>{this.state.sent ? `${this.state.time}秒后重新获取` : '获取验证码'}</Button>
                <TextField
                    label="输入验证码"
                    className={classes.templateItem}
                    onChange={onChange}
                />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Index));


