import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';

import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import ChatIcon from '@material-ui/icons/Chat';
import HelpIcon from '@material-ui/icons/HelpOutline';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import RefreshIcon from '@material-ui/icons/Refresh';

import { version } from '../../../package.json';

import { GROUPS, GROUPS_ } from '../../config/consts';
import { Group, Step } from '../../config/types';
import styles from '../../styles/appBar';
import { titleConverter } from '../../utils/titleConverter';

import Messenger from '../../containers/Messenger';
import Modal from '../Modal';
import Select from '../Select';

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    viewingRecruitment: string;
    group: string;
    steps: Step[];
    toggleDrawer: () => void;
    logout: () => void;
    setGroup: (group: Group) => void;
    setSteps: (stepType: number) => void;
}

class Bar extends PureComponent<Props & RouteComponentProps> {
    state = {
        anchorEl: undefined,
        modal: false,
        messenger: false
    };

    handleClick = ({ currentTarget }: React.MouseEvent) => {
        this.setState({ anchorEl: currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => {
        this.handleClose();
        this.props.logout();
    };

    handleChange = (type: 'group' | 'step') => ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
        const { setGroup, setSteps } = this.props;
        type === 'group' && setGroup(value as Group);
        type === 'step' && setSteps(+value);
    };

    toggleOpen = (name: string) => () => {
        this.setState((state) => ({ [name]: !state[name] }));
    };

    refresh = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    render() {
        const { classes, open, toggleDrawer, location: { pathname }, group, viewingRecruitment, steps } = this.props;
        const { messenger, modal, anchorEl } = this.state;
        const title = titleConverter(viewingRecruitment);
        const pathToTitle = {
            '/': `Unique Studio Recruitment Dashboard v${version}`,
            '/data': `${title}・数据展示`,
            '/candidates': `${title}・选手信息`,
            '/my': '组员信息',
        };
        return (
            <>
                <AppBar position='fixed' className={classNames(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar disableGutters={!open} classes={{ gutters: classes.appBarGutters, regular: classes.regular }}>
                        <IconButton
                            color='inherit'
                            onClick={toggleDrawer}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6' color='inherit' noWrap>{pathToTitle[pathname] || '808 / 2 = ?'}</Typography>
                        {pathname === '/candidates' && <>
                            <Select
                                data={GROUPS}
                                values={GROUPS_}
                                onChange={steps.length === 6 ? this.handleChange('group') : undefined}
                                currentValue={steps.length === 6 ? group : ''}
                            />
                            <Select
                                data={['全部', '群面']}
                                values={[0, 1]}
                                onChange={this.handleChange('step')}
                                currentValue={steps.length === 6 ? 0 : 1}
                            />
                        </>}
                        <div className={classNames(open && classes.hide, classes.rightButtons)}>
                            <IconButton color='inherit' onClick={this.toggleOpen('messenger')}>
                                <ChatIcon />
                            </IconButton>
                            <IconButton color='inherit' onClick={this.toggleOpen('modal')}>
                                <HelpIcon />
                            </IconButton>
                            <IconButton color='inherit' onClick={this.refresh}>
                                <RefreshIcon />
                            </IconButton>
                            <IconButton color='inherit' onClick={this.handleClick}>
                                <PersonIcon />
                            </IconButton>
                        </div>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.handleLogout}>退出</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Collapse in={messenger} classes={{ container: classes.collapse }}>
                    <Messenger />
                </Collapse>
                <Modal
                    title='面试问题提示'
                    open={modal}
                    onClose={this.toggleOpen('modal')}
                >
                    <div className={classes.suggestion}>
                        当你想不出什么问题的时候，不妨参照这里：<br />
                        <ul>
                            <li>简单介绍一下你自己</li>
                            <li>请评价一下你的熬测</li>
                            <li>熬测之后你又学/看了什么</li>
                            <li>未来规划</li>
                            <li>个人优缺点</li>
                            <li>你对我们团队了解有多少</li>
                            <li>你为什么选择来我们团队</li>
                            <li>对本组的理解（为什么选择xx组，为什么不选择xx组）</li>
                            <li>40小时打卡</li>
                            <li>加入团队后，你能为我们带来什么</li>
                            <li>没能加入团队的话，你有什么打算</li>
                            <li>考察合作意识（围绕各组合作展开，如design与web）</li>
                            <li>考察责任感（如紧急项目）</li>
                            <li>评价业界相关现象（前端娱乐圈，996，etc.）</li>
                            <li>你有什么问题要问我们吗</li>
                        </ul>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withStyles(styles)(Bar);
