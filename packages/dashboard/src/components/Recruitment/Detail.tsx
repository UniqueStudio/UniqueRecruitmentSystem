import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { BarChart } from '@components/Chart/BarChart';
import { GROUP_MAP, STEP_MAP } from '@config/consts';
import { Group } from '@config/enums';
import { useStores } from '@hooks/useStores';
import { TabLayout } from '@layouts/TabLayout';

export const RecruitmentDetail: FC = observer(() => {
    const { $recruitment } = useStores();

    const recruitment = $recruitment.viewingRecruitment;
    if (!recruitment) {
        return null;
    }
    const { statistics } = recruitment;

    const result = {} as Record<Group, number[]>;
    GROUP_MAP.forEach((_, group) => {
        result[group] = [];
        STEP_MAP.forEach((_, key) => {
            const current = statistics?.[group]?.[key] || 0;
            result[group].push(current);
        });
    });

    return (
        <TabLayout
            variant='scrollable'
            items={[...GROUP_MAP.entries()].map(([value, label]) => ({
                value,
                label,
                component: <BarChart data={result[value]} labels={[...STEP_MAP.values()]} title='各轮选手分布' />,
            }))}
        />
    );
});
