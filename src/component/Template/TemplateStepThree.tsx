import * as React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    onChange: (name: string) => (event: React.ChangeEvent) => void
}

class Step extends React.PureComponent<Props> {

    state = {
        sent: false
    };

    getCode = () => {
        this.setState({
            sent: true
        });
    };

    render() {
        const { classes, onChange } = this.props;

        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
                <Typography variant='subheading' className={classes.templateItem}>
                    {this.state.sent ? '我们已向你发送了验证码短信，若没有收到，点击重新获取验证码' : '我们将向你发送验证码短信，点击获取验证码'}
                </Typography>
                <Button color='primary' onClick={this.getCode}>{this.state.sent ? '重新获取' : '获取验证码'}</Button>
                <TextField
                    label="输入验证码"
                    className={classes.templateItem}
                    onChange={onChange('code')}
                />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


