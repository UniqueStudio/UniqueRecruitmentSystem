import React, { PureComponent } from "react";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import Chart from './Chart';
import ChartNew from './ChartNew';
import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import { Recruitment } from '../../reducer/recruitments';

interface Props extends WithStyles {
    data: Recruitment[];
    uid: string;
    canLaunch: boolean;
    fetchData: (uid: string) => void;
    toggleSnackbarOn: (info: string) => void;
    launchRecruitment: (info: object) => void;
}

class ChartContainer extends PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.props.fetchData(props.uid);
    }

    render() {
        const { data, toggleSnackbarOn, launchRecruitment, canLaunch } = this.props;
        const compare = (i: Recruitment, j: Recruitment) => {
            if (i === j) return 0;
            if (i.title.slice(0, 4) > j.title.slice(0, 4)) return 1;
            if ((i.title.slice(0, 4) === j.title.slice(0, 4) && i.title[4] < j.title[4])) return 1;
            return -1;
        };
        return (
            <>
                {data.sort(compare).map(i => {
                    const chartData = i.data;
                    const totalData = chartData.map(i => i.total || 0);
                    const flowData = [{}, ...chartData].reduce((i, j) => ({ ...i, [j['group']]: j['steps'] }));
                    const title = `${i.title.slice(0, 4) + { 'S': '春招', 'C': '夏令营', 'A': '秋招' }[i.title[4]]}各组报名人数`;
                    const endTime = i.end;
                    return <Chart data={chartData} totalData={totalData} flowData={flowData} title={title} end={endTime}
                                  key={i['_id']} />
                })}
                <ChartNew toggleSnackbarOn={toggleSnackbarOn} launchRecruitment={launchRecruitment}
                          disabled={!canLaunch} />
            </>
        )
    }
}

export default withRoot(withStyles(styles)(ChartContainer));
