import React, { FC, memo, useState } from 'react';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { ChartComponentProps, Doughnut } from './Doughnut';

import { GROUPS, GROUPS_, STEPS } from '../../config/consts';
import { Recruitment } from '../../config/types';

import { getRainbow } from '../../styles';
import useStyles from '../../styles/chart';

import { titleConverter } from '../../utils/titleConverter';

interface Props {
    data: Recruitment;
    setViewing: () => void;
}

const Chart: FC<Props> = memo(({ data: { groups, total, title, end }, setViewing }) => {
    const classes = useStyles();
    const [group, setGroup] = useState('');
    const [clicked, setClicked] = useState(false);
    const setData: ChartComponentProps['handleClick'] = (event, chart) => {
        const elements = chart.getElementsAtEvent(event);
        const element = elements[0];
        if (!element) return;
        /*
         * Chart.js provides some public apis to change data visibility:
         * ```ts
         * for (let i = 0; i < chart.data.labels.length; i++) {
         *     if (!chart.getDataVisibility(i)) {
         *         chart.toggleDataVisibility(i);
         *     }
         * }
         * ```
         * but I prefer the following way :)
         */
        chart._hiddenIndices = {};

        setClicked((prevClicked) => !prevClicked);
        setGroup((prevClicked) => prevClicked ? '' : GROUPS_[element.index]);
    };
    const viewingGroup = groups.find(({ name }) => name === group);
    const data = viewingGroup ? viewingGroup.steps : groups.map(({ total: groupTotal }) => groupTotal);
    const labels = viewingGroup ? STEPS : GROUPS;
    const text = viewingGroup ? `${viewingGroup.name}组各轮情况` : titleConverter(title);
    const chartData: ChartComponentProps['data'] = {
        labels,
        datasets: [{
            data,
            backgroundColor: getRainbow(500),
            hoverBackgroundColor: getRainbow(300),
        }],
    };
    const options: ChartComponentProps['options'] = {
        cutoutPercentage: clicked ? 50 : 75,
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
    return (
        <>
            <Button onClick={setViewing} variant='contained' color='primary'>浏览本次招新</Button>
            <Paper className={classNames(classes.chart, { [classes.expired]: expired })}>
                <div className={classes.doughnut}>
                    <Doughnut
                        data={chartData}
                        handleClick={setData}
                        options={options}
                        width={300}
                        height={300}
                    />
                </div>
                <Typography variant='body1' className={classes.centerText}>
                    {`总计：${viewingGroup ? viewingGroup.total : total}人`}
                </Typography>
            </Paper>
        </>
    );
});

export default Chart;
