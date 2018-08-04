import React, { PureComponent } from "react";
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from "../../style/group";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    messages: object[];
    sendMessage: (message: string) => void;
    sendImage: (image: string) => void;
}

class Messenger extends PureComponent<Props> {

    state = {
        messages: this.props.messages,
        content: ''
    };
    handleChange = (event: React.ChangeEvent) => {
        this.setState({
            content: event.target['value']
        });
    };
    handleImage = (event: React.ChangeEvent) => {
        const file = event.target['files'][0];
        if (!file) {
            return;
        }
        if (file.size > 1024 * 1024) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.props.sendImage(reader.result as string);
        }
    };
    send = () => {
        this.props.sendMessage(this.state.content);
        this.setState({
            content: ''
        })
    };

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.messages.length !== this.props.messages.length) {
            this.setState({
                messages: nextProps.messages
            })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.messenger}>
                <div className={classes.messages}>
                    {this.state.messages.map((i, j) =>
                        <div key={j} className={classNames(classes.messageContainer, { [classes.my]: i['isSelf'] })}>
                            <Avatar
                                alt={i['name']}
                                src={i['avatar']}
                                className={classes.avatar}
                            />
                            <Chip
                                label={
                                    <div className={classes.message}>
                                        <div>{`${i['name']} - ${new Date(i['time']).getHours()}:${new Date(i['time']).getMinutes()}:${new Date(i['time']).getSeconds()}`}</div>
                                        <Divider />
                                        <div className={classes.messageContent}>
                                            {i['type'] === 'text' ? i['message'] :
                                                <img src={i['message']} style={{ width: '100%' }} />}
                                        </div>
                                    </div>
                                }
                                classes={{
                                    root: classes.chipRoot
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.input}>
                    <Divider />
                    <div className={classes.inputContent}>
                        <input accept="image/png, image/jpeg" className={classes.hidden} id="file" type="file"
                               onChange={this.handleImage} />
                        <label htmlFor="file">
                            <IconButton color="primary" component="span">
                                <InsertPhotoIcon />
                            </IconButton>
                        </label>
                        <TextField
                            multiline
                            value={this.state.content}
                            className={classes.textField}
                            margin="normal"
                            onChange={this.handleChange}
                        />
                        <IconButton color="primary" component="span" onClick={this.send}
                                    disabled={this.state.content.length === 0}>
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>
            </Paper>
        )
    }
}

export default withRoot(withStyles(styles)(Messenger));

