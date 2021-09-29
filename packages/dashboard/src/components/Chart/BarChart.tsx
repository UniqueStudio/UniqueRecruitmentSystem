import { useTheme } from '@mui/material';
import React, { FC, memo } from 'react';

import { BaseChart } from '@components/Chart/BaseChart';
import { getRainbow } from '@styles/index';

interface Props {
    data: number[];
    labels: string[];
    title: string;
}

export const BarChart: FC<Props> = memo(({ data, labels, title }) => {
    const theme = useTheme();
    return (
        <BaseChart<'bar', number[], string>
            type='bar'
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
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        color: theme.palette.text.primary,
                        text: title,
                        position: 'bottom',
                    },
                    legend: {
                        display: false,
                    },
                },
            }}
            height={500}
        />
    );
});
