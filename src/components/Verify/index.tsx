import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import styles from '../../styles/verify';

interface Props extends WithStyles<typeof styles> {
    code: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    getVerifyCode: () => void;
}

class Verify extends PureComponent<Props> {

    state = {
        sent: false,
        time: 0,
    };

    interval = NaN;

    tick = () => {
        this.setState(({ time }: { time: number }) => {
            if (time === 0) {
                window.clearInterval(this.interval);
                return { sent: false };
            }
            return { time: time - 1 };
        });
    };

    getCode = () => {
        this.props.getVerifyCode();
        this.setState({
            sent: true,
            time: 60,
        });
        this.interval = window.setInterval(this.tick, 1000);
    };

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    render() {
        const { classes, onChange, code } = this.props;
        const { sent, time } = this.state;
        return (
            <div className={classNames(classes.content, classes.item)}>
                <Button
                    color='primary'
                    onClick={this.getCode}
                    disabled={sent}
                >
                    {sent ? `${time}秒后重新获取` : '获取验证码'}
                </Button>
                <TextField
                    label='输入验证码'
                    className={classNames(classes.item, classes.input)}
                    onChange={onChange}
                    value={code}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Verify);
