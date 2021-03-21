import React, { FC, memo, useState } from 'react';

import clsx from 'clsx';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { ChartComponentProps, ChartElement, Doughnut } from './Doughnut';

import { GROUPS, GROUPS_, STEPS } from '../../config/consts';
import { Recruitment } from '../../config/types';

import { getRainbow } from '../../styles';
import useStyles from '../../styles/chart';

import { useTheme } from '@material-ui/core';
import { titleConverter } from '../../utils/titleConverter';

interface Props {
    data: Recruitment;
    setViewing: () => void;
}

const Chart: FC<Props> = memo(({ data: { groups, total, title, end }, setViewing }) => {
    const classes = useStyles();
    const [group, setGroup] = useState('');
    const [clicked, setClicked] = useState(false);
    const theme = useTheme();
    const setData = (elements: ChartElement[]) => {
        const element = elements[0];
        if (!element) return;
        // reset legend
        element._chart.data.datasets[0]._meta[element._chart.id].data.forEach((item) => (item.hidden = false));
        setClicked((prevClicked) => !prevClicked);
        setGroup((prevClicked) => (prevClicked ? '' : GROUPS_[element._index]));
    };
    const viewingGroup = groups.find(({ name }) => name === group);
    const data = viewingGroup ? viewingGroup.steps : groups.map(({ total: groupTotal }) => groupTotal);
    const labels = viewingGroup ? STEPS : GROUPS;
    const text = viewingGroup ? `${viewingGroup.name}组各轮情况` : titleConverter(title);
    const chartData: ChartComponentProps['data'] = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: getRainbow(500),
                hoverBackgroundColor: getRainbow(300),
            },
        ],
    };
    const options: ChartComponentProps['options'] = {
        cutoutPercentage: clicked ? 50 : 75,
        maintainAspectRatio: false,
        title: {
            display: true,
            fontColor: theme.palette.text.primary,
            text,
        },
        legend: {
            position: 'bottom' as 'bottom',
            labels: {
                boxWidth: 12,
                fontColor: theme.palette.text.primary,
            },
        },
    };
    const expired = Date.now() > end;
    return (
        <>
            <Button onClick={setViewing} variant='contained' color='primary'>
                浏览本次招新
            </Button>
            <Paper className={clsx(classes.chart, { [classes.expired]: expired })}>
                <div className={classes.doughnut}>
                    <Doughnut data={chartData} handleClick={setData} options={options} width={300} height={300} />
                </div>
                <Typography variant='body1' className={classes.centerText}>
                    {`总计：${viewingGroup ? viewingGroup.total : total}人`}
                </Typography>
            </Paper>
        </>
    );
});

export default Chart;
