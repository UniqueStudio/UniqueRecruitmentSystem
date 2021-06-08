import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';

import { Slots } from '@components/Slots';
import { Table } from '@components/Table';
import { StepType } from '@config/enums';
import { useStores } from '@hooks/useStores';
import { TabLayout } from '@layouts/TabLayout';

const Interviews: FC = observer(() => {
    const { $application } = useStores();

    useEffect(() => {
        if ($application.stepType === StepType.all) {
            $application.setSteps(StepType.groupInterview);
        }
    }, [$application.stepType]);

    const name = $application.stepType === StepType.teamInterview ? '群面' : '组面';

    return (
        <TabLayout
            items={[
                { label: `${name}时间安排`, value: 'slots', component: <Slots /> },
                { label: `${name}时间选择阶段候选人信息`, value: 'table', component: <Table /> },
            ]}
        />
    );
});

export default Interviews;
