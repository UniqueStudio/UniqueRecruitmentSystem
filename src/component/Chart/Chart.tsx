import React, { PureComponent } from "react";
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import blue from '@material-ui/core/colors/blue';
import cyan from '@material-ui/core/colors/cyan';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { Doughnut } from 'react-chartjs-2';

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import { Data, GROUP } from '../../lib/const';

const getColors = (i: number) => [red[i], purple[i], indigo[i], blue[i], cyan[i], green[i], yellow[i], orange[i]];

interface Props extends WithStyles {
    data: Data[];
    totalData: number[];
    flowData: object;
    title: string;
    end: number;
}

class Chart extends PureComponent<Props> {

    state = {
        labels: GROUP,
        data: [...this.props.totalData],
        clicked: false,
        title: this.props.title
    };
    setData = (e: any) => {
        // magic function to reset legend
        if (e.length) e['0']._chart.data.datasets['0']._meta[e['0']._chart.id].data.map((i: object) => i['hidden'] = false);
        if (!this.state.clicked && e.length) {
            const i = e['0']._index;
            this.setState({
                labels: ['报名被刷', '笔试被刷', '面试被刷', '熬测被刷', '群面被刷', '通过'],
                data: { ...this.props.flowData }[GROUP[i].toLowerCase()],
                clicked: true,
                title: `${GROUP[i]}组各轮情况`
            });
        } else if (this.state.clicked === Boolean(e.length)) {
            this.setState({
                title: this.props.title,
                labels: GROUP,
                data: [...this.props.totalData],
                clicked: false,
            });
        }
    };

    render() {
        const dataSet = {
            labels: this.state.labels,
            datasets: [{
                data: this.state.data,
                backgroundColor: getColors(500),
                hoverBackgroundColor: getColors(300),
            }]
        };
        const options: any = {
            cutoutPercentage: this.state.clicked ? 50 : 75,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: this.state.title
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12
                }
            }
        };
        const { classes, end } = this.props;
        const expired = +new Date() > end;
        const ChartBox = <Paper className={classNames(classes.chart, { [classes.expired]: expired })}>
            <div className={classes.doughnut}>
                <Doughnut
                    data={dataSet}
                    onElementsClick={this.setData}
                    options={options} width={300} height={300}
                />
            </div>
            <Typography variant='body1' className={classes.centerText}>{
                `总计：${this.state.data.reduce((i, j) => i + j)}人`
            }</Typography>
        </Paper>;
        return expired ? <Tooltip title="该招新已过期" classes={{ tooltip: classes.tooltip }}
                                  placement='top'>{ChartBox}</Tooltip> : ChartBox
    }
}

export default withRoot(withStyles(styles)(Chart));
