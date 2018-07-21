import * as React from "react";
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from "../../style/user";
import withRoot from "../../style/withRoot";
import { GROUP } from '../../lib/const';

interface Props extends WithStyles {
    username: string;
    uid: string;
    info: object;
    fetchInfo: (uid: string) => void;
    submitInfo: (uid: string, info: object) => void;
    toggleSnackbar: (info: string, color: string) => void;
}

class User extends React.PureComponent<Props> {
    submitChange = () => {
        if (Object.values(this.state.info).includes('')) {
            this.props.toggleSnackbar('请完整填写信息', 'warning');
        } else if (this.state.info === this.props.info) {
            this.props.toggleSnackbar('你没有做任何修改', 'info');
        } else {
            this.props.submitInfo(this.props.uid, this.state.info);
        }
    };

    state = {
        name: this.props.username,
        info: this.props.info as any
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        if (name === 'name') {
            this.setState({
                name: event.target['value']
            })
        } else {
            this.setState({
                info: {
                    ...this.state.info,
                    [name]: event.target['value']
                },
            });
        }
    };

    constructor(props: Props) {
        super(props);
        const { fetchInfo, uid } = this.props;
        uid.length && fetchInfo(uid);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.info !== this.props.info) {
            this.setState({ info: nextProps.info })
        }
    }

    render() {
        const { classes } = this.props;
        const { sex, group, isAdmin, isCaptain, phone, mail, joinTime } = this.state.info;
        return sex !== undefined && (
            <Paper className={classes.container}>
                <TextField
                    label="姓名"
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    className={classes.userInfo}
                />
                <FormControl className={classes.userInfo}>
                    <InputLabel>性别</InputLabel>
                    <Select
                        value={sex}
                        onChange={this.handleChange('sex')}
                    >
                        <MenuItem value='Male'>男</MenuItem>
                        <MenuItem value='Female'>女</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.userInfo}>
                    <InputLabel>组别</InputLabel>
                    <Select
                        value={group}
                        onChange={this.handleChange('group')}
                    >
                        {GROUP.map(i => <MenuItem value={i.toLowerCase()} key={i}>{i}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl className={classes.userInfo}>
                    <InputLabel>加入时间</InputLabel>
                    <Select
                        value={joinTime}
                        onChange={this.handleChange('joinTime')}
                    >
                        {(() => {
                            const year = new Date().getFullYear();
                            return [year - 3, year - 2, year - 1, year].map(i =>
                                [{ a: '春招', b: 'S' }, { a: '夏令营', b: 'C' }, { a: '秋招', b: 'A' }].map(j =>
                                    <MenuItem value={i + j.b}>{i + j.a}</MenuItem>
                                ))
                        })()}
                    </Select>
                </FormControl>
                <FormControl className={classes.userInfo}>
                    <InputLabel>组长?</InputLabel>
                    <Select
                        value={isCaptain ? 1 : 0}
                        onChange={this.handleChange('isCaptain')}
                    >
                        <MenuItem value={1}>是</MenuItem>
                        <MenuItem value={0}>否</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.userInfo}>
                    <InputLabel>管理员?</InputLabel>
                    <Select
                        value={isAdmin ? 1 : 0}
                        onChange={this.handleChange('isAdmin')}
                    >
                        <MenuItem value={1}>是</MenuItem>
                        <MenuItem value={0}>否</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="手机号"
                    value={phone}
                    onChange={this.handleChange('phone')}
                    margin="normal"
                    className={classes.userInfo}
                />
                <TextField
                    label="邮箱"
                    value={mail}
                    onChange={this.handleChange('mail')}
                    className={classes.userInfo}
                    margin="normal"
                />
                <div>
                    <Button size='large' onClick={this.submitChange} color='primary'>修改</Button>
                </div>
            </Paper>
        )
    }
}

export default withRoot(withStyles(styles)(User));