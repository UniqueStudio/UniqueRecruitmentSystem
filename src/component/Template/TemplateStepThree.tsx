import * as React from 'react';
import * as classNames from 'classnames';
import {
    Button, TextField,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../../style/template'
import withRoot from '../../style/withRoot';

class Step extends React.Component<WithStyles> {

    state = {
        sent: false
    };

    sendSMS = () => {
        this.setState({
            sent: true
        })
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
                <Typography variant='subheading' className={classes.templateItem}>
                    {this.state.sent ? '我们已向你发送了验证码短信，若没有收到，点击重新获取验证码' : '我们将向你发送验证码短信，点击获取验证码'}
                </Typography>
                <Button color='primary' onClick={this.sendSMS}>{this.state.sent ? '重新获取' : '获取验证码'}</Button>
                <TextField
                    label="输入验证码"
                    className={classes.templateItem}
                />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


