import React, { PureComponent } from 'react';
import { Doughnut } from 'react-chartjs-2';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GROUPS, GROUPS_, STEPS } from 'Config/consts';
import { Recruitment } from 'Config/types';

import styles from 'Styles/dashboard';
import { getColors } from 'Styles/index';
import titleConverter from 'Utils/titleConverter';

interface Props extends WithStyles {
    data: Recruitment;
    onClick: () => void;
}

interface Element {
    _chart: {
        data: {
            datasets: { _meta: object }[];
        };
        id: number;
    };
    _index: number;
}

class Chart extends PureComponent<Props> {

    state = {
        clicked: false,
        group: '',
    };

    setData = (elements: Element[]) => {
        // magic function to reset legend
        const length = elements.length;
        const first = elements[0];
        if (length) {
            first._chart.data.datasets[0]._meta[first._chart.id].data.map((data: object) =>
                data['hidden'] = false
            );
        }
        const { clicked } = this.state;
        if (!clicked && length) {
            this.setState({
                clicked: true,
                group: GROUPS_[first._index]
            });
        } else if (clicked === Boolean(length)) {
            this.setState({
                clicked: false,
                group: ''
            });
        }
    };

    render() {
        const { data: { groups, total, title, end }, classes, onClick } = this.props;
        const group = groups.find(({ name }) => name === this.state.group);
        const data = group ? group.steps : groups.map(({ total: groupTotal }) => groupTotal);
        const labels = group ? STEPS : GROUPS;
        const text = group ? `${group.name}组各轮情况` : titleConverter(title);
        const dataSet = {
            labels,
            datasets: [{
                data,
                backgroundColor: getColors(500),
                hoverBackgroundColor: getColors(300),
            }],
        };
        const options = {
            cutoutPercentage: this.state.clicked ? 50 : 75,
            maintainAspectRatio: false,
            title: {
                display: true,
                text,
            },
            legend: {
                position: 'bottom' as 'bottom',
                labels: {
                    boxWidth: 12,
                },
            },
        };
        const expired = Date.now() > end;
        const ChartBox =
            <Paper className={classNames(classes.chart, { [classes.expired]: expired })}>
                <div className={classes.doughnut}>
                    <Doughnut
                        data={dataSet}
                        onElementsClick={this.setData}
                        options={options}
                        width={300}
                        height={300}
                    />
                </div>
                <Typography variant='body1' className={classes.centerText}>{
                    `总计：${group ? group.total : total}人`
                }</Typography>
            </Paper>;
        return (
            <div className={classes.block}>
                <Button onClick={onClick} variant='contained' color='primary'>浏览本次招新</Button>
                {!expired ? ChartBox :
                    <Tooltip
                        title='该招新报名已截止'
                        classes={{ tooltip: classes.tooltip }}
                        placement='top'
                    >
                        {ChartBox}
                    </Tooltip>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Chart);
