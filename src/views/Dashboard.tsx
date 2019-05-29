import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';
import { OptionsObject } from 'notistack';

import AddOne from '../components/AddOne';
import Chart from '../components/Chart';
import { Recruitment } from '../config/types';
import styles from '../styles/dashboard';

interface Props extends WithStyles<typeof styles> {
    data: Recruitment[];
    canLaunch: boolean;
    viewing: string;
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
    launchRecruitment: (info: Partial<Recruitment>) => void;
    setViewing: (title: string) => void;
}

class Dashboard extends PureComponent<Props> {

    state = {
        shouldClear: false,
        shouldRedirect: false,
    };

    componentDidUpdate({ viewing, data: { length } }: Props) {
        this.setState((prevState, props) => ({
            shouldClear: length !== props.data.length,
            shouldRedirect: viewing !== props.viewing && viewing
        }));
    }

    setViewing = (title: string) => () => {
        this.props.setViewing(title);
    };

    render() {
        const { data, classes, canLaunch, enqueueSnackbar, launchRecruitment } = this.props;
        const { shouldClear, shouldRedirect } = this.state;
        return shouldRedirect ? <Redirect to='/data' /> : (
            <div className={classes.root}>
                <div className={classes.left}>
                    <Typography variant='h4' className={classes.title}>Recruitments</Typography>
                    <Divider variant='middle' />
                    <div className={classes.blocksContainer}>
                        <div className={classes.block}>
                            <AddOne
                                enqueueSnackbar={enqueueSnackbar}
                                launchRecruitment={launchRecruitment}
                                disabled={!canLaunch}
                                shouldClear={shouldClear}
                            />
                        </div>
                        {data.length ? data.map((recruitment) =>
                            <Chart
                                key={recruitment._id}
                                data={recruitment}
                                onClick={this.setViewing(recruitment.title)}
                            />
                        ) : null}
                    </div>
                </div>
                <div className={classes.right}>
                    <Typography variant='h4' className={classes.title}>Notifications</Typography>
                    <Divider variant='middle' />
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
                        </ul>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);
