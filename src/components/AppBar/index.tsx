import React, { ChangeEventHandler, FC, memo, MouseEventHandler, useMemo, useState } from 'react';

import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
import HelpIcon from '@material-ui/icons/HelpOutline';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import RefreshIcon from '@material-ui/icons/Refresh';

import Modal from '../Modal';
import Select from '../Select';

import { GROUPS, GROUPS_ } from '../../config/consts';
import { Group } from '../../config/types';

import { Props } from '../../containers/AppBar';
import Messenger from '../../containers/Messenger';

import useStyles from '../../styles/appBar';

import { titleConverter } from '../../utils/titleConverter';

import { version } from '../../../package.json';
import { DarkModeSwitcher } from './darkMode';

const Bar: FC<Props> = memo(({ open, location: { pathname }, group, title, steps, logout, setSteps, setGroup, toggleDrawer }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [modal, setModal] = useState(false);
    const [messenger, setMessenger] = useState(false);

    const handleClick: MouseEventHandler = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const handleChange = (type: 'group' | 'step'): ChangeEventHandler<{ name?: string; value: unknown }> => ({ target: { value } }) => {
        type === 'group' && setGroup(value as Group);
        type === 'step' && setSteps(+(value as string));
    };

    const toggleModal = () => {
        setModal((prevModal) => !prevModal);
    };

    const toggleMessenger = () => {
        setMessenger((prevMessenger) => !prevMessenger);
    };

    const refresh = () => {
        window.sessionStorage.clear();
        window.location.reload();
    };

    title = titleConverter(title);
    const pathToTitle = {
        '/': `Unique Studio Recruitment Dashboard v${version}`,
        '/data': `${title}・数据展示`,
        '/candidates': `${title}・选手信息`,
        '/my': '组员信息',
    };

    const Suggestion = useMemo(() => (
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
                <li>
                    考察合作意识（围绕各组合作展开）
                    <ul>
                        <li>design提出的不喜欢的设计（web、android、iOS）</li>
                        <li>pm提出的不合理的需求（web、android、iOS、design）</li>
                        <li>合作对方咕咕咕</li>
                    </ul>
                </li>
                <li>考察责任感（如紧急项目、ddl）</li>
                <li>面对全新的知识领域，如何学习</li>
                <li>评价业界相关现象（对程序员这个职业的看法，前端娱乐圈，996，etc.）</li>
                <li>如何看待室友、同学他们的学习</li>
                <li>你想作为技术管理者还是技术专家</li>
                <li>团队风气（如互膜）</li>
                <li>你有什么问题要问我们吗</li>
            </ul>
        </div>
        // eslint-disable-next-line
    ), []);
    return (
        <>
            <AppBar position='fixed' className={classNames(classes.appBar, { [classes.appBarShift]: open })}>
                <Toolbar disableGutters={!open} classes={{ gutters: classes.appBarGutters, regular: classes.regular }}>
                    {useMemo(() => (
                        <IconButton
                            color='inherit'
                            onClick={toggleDrawer}
                            className={classNames(classes.menuButton, { [classes.hide]: open })}
                        >
                            <MenuIcon />
                        </IconButton>
                        // eslint-disable-next-line
                    ), [open])}
                    <Typography variant='h6' color='inherit' noWrap>{pathToTitle[pathname] || '808 / 2 = ?'}</Typography>
                    {pathname === '/candidates' && <>
                        <Select
                            data={['全部', '群面']}
                            values={[0, 1]}
                            onChange={handleChange('step')}
                            currentValue={steps.length === 6 ? 0 : 1}
                        />
                        {steps.length === 6 && <Select
                            data={GROUPS}
                            values={GROUPS_}
                            onChange={handleChange('group')}
                            currentValue={group}
                        />}
                    </>}
                    {useMemo(() => (
                        <div className={classNames(open && classes.hide, classes.rightButtons)}>
                            <IconButton color='inherit' onClick={toggleMessenger}>
                                <ChatIcon />
                            </IconButton>
                            <IconButton color='inherit' onClick={toggleModal}>
                                <HelpIcon />
                            </IconButton>
                            <IconButton color='inherit' onClick={refresh}>
                                <RefreshIcon />
                            </IconButton>
                            <DarkModeSwitcher />
                            <IconButton color='inherit' onClick={handleClick}>
                                <PersonIcon />
                            </IconButton>
                        </div>
                        // eslint-disable-next-line
                    ), [open])}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleLogout}>退出</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Collapse in={messenger} classes={{ container: classes.collapse }}>
                <Messenger />
            </Collapse>
            <Modal title='面试问题提示' open={modal} onClose={toggleModal}>
                {Suggestion}
            </Modal>
        </>
    );
});

export default Bar;
