import * as React from 'react';
import {
    WithStyles,
    withStyles
} from '@material-ui/core';
import { red, purple, indigo, blue, cyan, green, yellow, orange } from '@material-ui/core/colors';
import { Doughnut } from 'react-chartjs-2';

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';
import { GROUP } from '../../constants';

const getColors = (i: number) => [
    red[i],
    purple[i],
    indigo[i],
    blue[i],
    cyan[i],
    green[i],
    yellow[i],
    orange[i],
];

const totalData = [8, 7, 6, 5, 4, 3, 2, 1];

const flowData = {
    'web': [1, 2, 3, 1, 2, 3],
    'lab': [4, 5, 6, 1, 2, 3],
    'ai': [7, 8, 9, 1, 2, 3],
    'game': [10, 11, 12, 1, 2, 3],
    'android': [13, 14, 15, 1, 2, 3],
    'ios': [16, 17, 18, 1, 2, 3],
    'design': [19, 20, 21, 1, 2, 3],
    'pm': [22, 23, 24, 1, 2, 3],
};

interface Props extends WithStyles {
    time: string;
}

class Chart extends React.Component<Props> {

    title = `${this.props.time}各组报名人数: 总计${totalData.reduce((i, j) => i + j)}`;

    state = {
        labels: GROUP,
        data: [...totalData],
        clicked: false,
        title: this.title
    };

    setData = (e: any) => {
        // magic function to reset legend
        if (e.length) e['0']._chart.data.datasets['0']._meta[`${e['0']._chart.id}`].data.map((i: any) => i.hidden = false);
        if (!this.state.clicked) {
            if (e.length) {
                const i = e['0']._index;
                this.setState({
                    labels: ['报名被刷', '笔试被刷', '面试被刷', '熬测被刷', '群面被刷', '通过'],
                    data: flowData[GROUP[i].toLowerCase()],
                    clicked: true,
                    title: `${GROUP[i]}组各轮情况`
                });
            } else {
                this.setState({
                    title: this.title,
                    labels: GROUP,
                    data: [...totalData],
                    clicked: false,
                });
            }
        } else {
            if (e.length) {
                this.setState({
                    title: this.title,
                    labels: GROUP,
                    data: [...totalData],
                    clicked: false,
                });
            }
        }
    };

    render() {
        const data = {
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
                    boxWidth: 10
                }
            }
        };
        return (
            <Doughnut
                data={data}
                onElementsClick={(e) => this.setData(e)}
                options={options} width={300} height={300} />
        )
    }
}

export default withRoot(withStyles(styles)(Chart));
