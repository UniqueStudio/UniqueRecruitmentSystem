import React, { FC, memo, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Chart from '../components/Chart';

import AddOne from '../containers/AddOne';
import { Props } from '../containers/Dashboard';

import { usePrevious } from '../hooks/usePrevious';

import useStyles from '../styles/dashboard';

const Dashboard: FC<Props> = memo(({ data, setViewing, viewing }) => {
    const classes = useStyles();
    const [shouldClear, setShouldClear] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const prevData = usePrevious(data);
    const prevViewing = usePrevious(viewing);
    useEffect(() => {
        if (prevData !== undefined && prevViewing !== undefined) {
            setShouldClear(prevData.length !== data.length);
            setShouldRedirect(prevViewing !== viewing && !!prevViewing);
        }
    }, [data, viewing, prevData, prevViewing]);
    const handleSet = (title: string) => () => {
        setViewing(title);
    };
    return shouldRedirect ? (
        <Redirect to='/data' />
    ) : (
        <div className={classes.root}>
            <div className={classes.left}>
                <Typography variant='h4' className={classes.title}>
                    Recruitments
                </Typography>
                <Divider variant='fullWidth' />
                <div className={classes.blocksContainer}>
                    <div className={classes.block}>
                        <AddOne shouldClear={shouldClear} />
                    </div>
                    {!!data.length &&
                        data
                            .slice()
                            .reverse()
                            .map((recruitment) => (
                                // using slice() to create a shallow copy in case the
                                // switching between router case problem
                                // maybe it's better to change the order in backend :(
                                <div key={recruitment._id} className={classes.block}>
                                    <Chart
                                        data={recruitment}
                                        selected={viewing === recruitment.title}
                                        setViewing={handleSet(recruitment.title)}
                                    />
                                </div>
                            ))}
                </div>
            </div>
            <div className={classes.right}>
                <Typography variant='h4' className={classes.title}>
                    Notifications
                </Typography>
                <Divider variant='fullWidth' />
                <Paper className={classes.paper}>
                    <ul>
                        <li>顶部工具栏有聊天室、面试问题、刷新及退出</li>
                        <li>shift + 滚轮 可以横向滚动</li>
                        <li>栏与栏内项目均可拖动（牺牲了各栏高度的统一）</li>
                        <li>不能查看自己这届的候选人</li>
                        <li>左侧甜甜圈图划掉组别，中间的人数并不会减少</li>
                        <li>简历不存在时按钮是禁用的，但是速度仍然很慢</li>
                        <li>
                            <del>通知是写死的，面试问题也是</del>
                        </li>
                        <li>What's new in v3.0</li>
                        <ul>
                            <li>新增了黑暗模式，右上角有切换按钮</li>
                            <li>管理员可以设置本组其他成员为管理员（设置后不可以取消）</li>
                            <li>重新排列了首页的招新，最近的招新会在最上面</li>
                        </ul>
                    </ul>
                </Paper>
            </div>
        </div>
    );
});

export default Dashboard;
