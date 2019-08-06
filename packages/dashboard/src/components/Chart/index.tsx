import React, { FC, memo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { GROUPS, GROUPS_, STEPS } from '../../config/consts';
import { Recruitment } from '../../config/types';

import { getRainbow } from '../../styles';
import useStyles from '../../styles/chart';

import { titleConverter } from '../../utils/titleConverter';

interface Props {
    data: Recruitment;
    setViewing: () => void;
}

interface Element {
    _chart: {
        data: {
            datasets: { _meta: Record<number, { data: { hidden: boolean }[] }> }[];
        };
        id: number;
    };
    _index: number;
}

const Chart: FC<Props> = memo(({ data: { groups, total, title, end }, setViewing }) => {
    const classes = useStyles();
    const [group, setGroup] = useState('');
    const [clicked, setClicked] = useState(false);
    const setData = (elements: Element[]) => {
        // magic function to reset legend
        const length = elements.length;
        const first = elements[0];
        if (length) {
            first._chart.data.datasets[0]._meta[first._chart.id].data.map((item) => item.hidden = false);
        }
        if (!clicked && length) {
            setClicked(true);
            setGroup(GROUPS_[first._index]);
        } else if (clicked === Boolean(length)) {
            setClicked(false);
            setGroup('');
        }
    };
    const viewingGroup = groups.find(({ name }) => name === group);
    const data = viewingGroup ? viewingGroup.steps : groups.map(({ total: groupTotal }) => groupTotal);
    const labels = viewingGroup ? STEPS : GROUPS;
    const text = viewingGroup ? `${viewingGroup.name}组各轮情况` : titleConverter(title);
    const dataSet = {
        labels,
        datasets: [{
            data,
            backgroundColor: getRainbow(500),
            hoverBackgroundColor: getRainbow(300),
        }],
    };
    const options = {
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
    const ChartBox = (
        <Paper className={classNames(classes.chart, { [classes.expired]: expired })}>
            <div className={classes.doughnut}>
                <Doughnut
                    data={dataSet}
                    onElementsClick={setData}
                    options={options}
                    width={300}
                    height={300}
                />
            </div>
            <Typography variant='body1' className={classes.centerText}>
                {`总计：${viewingGroup ? viewingGroup.total : total}人`}
            </Typography>
        </Paper>
    );
    return (
        <>
            <Button onClick={setViewing} variant='contained' color='primary'>浏览本次招新</Button>
            {expired
                ? <Tooltip title='该招新已结束' classes={{ tooltip: classes.tooltip }} placement='top'>
                    {ChartBox}
                </Tooltip>
                : ChartBox
            }
        </>
    );
});

export default Chart;
