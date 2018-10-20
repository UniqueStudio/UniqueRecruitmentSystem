import React, { PureComponent } from 'react';

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

import styles from '../../style/chart';

import { Data, GROUPS, STEPS } from '../../lib/const';

const getColors = (i: number) => [red[i], purple[i], indigo[i], blue[i], cyan[i], green[i], yellow[i], orange[i]];

interface Props extends WithStyles {
    data: Data[];
    totalData: number[];
    stepData: object;
    title: string;
    end: number;
}

class Chart extends PureComponent<Props> {

    state = {
        labels: GROUPS,
        data: [...this.props.totalData],
        clicked: false,
        title: this.props.title,
    };
    setData = (e: object[]) => {
        // magic function to reset legend
        const { /*end, */title, totalData, stepData } = this.props;
        // const expired = +new Date() > end;
        if (e.length) e['0']._chart.data.datasets['0']._meta[e['0']._chart.id].data.map((i: object) => i['hidden'] = false);
        if (!this.state.clicked && e.length) {
            const i = e['0']._index;
            this.setState({
                labels: STEPS/*.map((i, j) => expired ? `${i.slice(0, 2)}${j === 5 ? '' : '被刷'}` : i)*/,
                data: { ...stepData }[GROUPS[i].toLowerCase()],
                clicked: true,
                title: `${GROUPS[i]}组各轮情况`,
            });
        } else if (this.state.clicked === Boolean(e.length)) {
            this.setState({
                title,
                labels: GROUPS,
                data: [...totalData],
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
            }],
        };
        const options = {
            cutoutPercentage: this.state.clicked ? 50 : 75,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: this.state.title,
            },
            legend: {
                position: 'bottom' as 'bottom',
                labels: {
                    boxWidth: 12,
                },
            },
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
        return expired ? <Tooltip title='该招新报名已截止' classes={{ tooltip: classes.tooltip }}
                                  placement='top'>{ChartBox}</Tooltip> : ChartBox;
    }
}

export default withStyles(styles)(Chart);
