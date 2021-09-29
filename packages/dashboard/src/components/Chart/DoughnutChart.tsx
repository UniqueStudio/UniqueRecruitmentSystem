import { useTheme } from '@mui/material';
import { ChartOptions } from 'chart.js';
import React, { FC, memo } from 'react';

import { BaseChart } from '@components/Chart/BaseChart';
import { getRainbow } from '@styles/index';

interface Props {
    data: number[];
    labels: string[];
    title: string;
    onClick: ChartOptions['onClick'];
}

export const DoughnutChart: FC<Props> = memo(({ data, labels, title, onClick }) => {
    const theme = useTheme();
    return (
        <BaseChart<'doughnut', number[], string>
            type='doughnut'
            data={{
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: getRainbow(500),
                        hoverBackgroundColor: getRainbow(300),
                    },
                ],
            }}
            options={{
                cutout: '75%',
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        color: theme.palette.text.primary,
                        text: title,
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            color: theme.palette.text.primary,
                        },
                    },
                },
                onClick,
            }}
        />
    );
});
