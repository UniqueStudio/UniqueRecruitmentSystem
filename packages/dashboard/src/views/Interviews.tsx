import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';

import { Table } from '@components/Table';
import { StepType } from '@config/enums';
import { useStores } from '@hooks/useStores';

const Interviews: FC = observer(() => {
    const { $candidate } = useStores();

    useEffect(() => {
        if ($candidate.stepType === StepType.all) {
            $candidate.setSteps(StepType.groupInterview);
        }
    }, [$candidate.stepType]);

    return (
        <>
            <Table />
        </>
    );
});

export default Interviews;
