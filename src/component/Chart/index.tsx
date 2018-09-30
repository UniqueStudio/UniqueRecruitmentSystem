import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import ChartContainer from './ChartContainer';
import ChartNew from './ChartNew';

import styles from '../../style/chart';
import withRoot from '../../style/withRoot';

import { Recruitment, Time } from '../../lib/const';

interface Props extends WithStyles {
    data: Recruitment[];
    status: string;
    canLaunch: boolean;
    userGroup: string;
    fetchData: () => void;
    toggleSnackbarOn: (info: string, color?: string) => void;
    launchRecruitment: (info: object) => void;
    setRecruitment: (data: object) => void;
}

class Index extends PureComponent<Props> {

    state = {
        modalOpen: '',
    };

    submit = (title: string, begin: number, end: number, time1: { [group: string]: Time[] }, time2: Time[]) => {
        this.props.setRecruitment({ title, begin, end, time1, time2 });
    };

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        const { data, toggleSnackbarOn, launchRecruitment, canLaunch, status, fetchData, classes, userGroup } = this.props;
        const compare = (i: Recruitment, j: Recruitment) => {
            if (i === j) return 0;
            if (i.title.slice(0, 4) > j.title.slice(0, 4)) return 1;
            if ((i.title.slice(0, 4) === j.title.slice(0, 4) && i.title[4] < j.title[4])) return 1;
            return -1;
        };
        return (
            <>
                {data.sort(compare).map(
                    (i, j) => <ChartContainer
                        key={j}
                        data={i}
                        userGroup={userGroup}
                        canLaunch={canLaunch}
                        submit={this.submit}
                        toggleSnackbarOn={toggleSnackbarOn}
                    />)}
                <div className={classes.chartContainer}>
                    <Button disabled={!canLaunch}>发起招新</Button>
                    <ChartNew
                        toggleSnackbarOn={toggleSnackbarOn}
                        launchRecruitment={launchRecruitment}
                        disabled={!canLaunch}
                        status={status}
                        fetchData={fetchData}
                    />
                </div>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Index));
