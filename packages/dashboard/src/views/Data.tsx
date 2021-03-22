import React, { ChangeEventHandler, FC, useState } from 'react';

import { observer } from 'mobx-react-lite';

import Recruitment from '../components/Recruitment';
import Table from '../components/Table';
import { useStores } from '../hooks/useStores';
import useStyles from '../styles/data';
import { groupSort, teamSort } from '../utils/sortBySlot';

const Data: FC = observer(() => {
    const { candidateStore, userStore, recruitmentStore } = useStores();
    const classes = useStyles();
    const [interviewType, setInterviewType] = useState<'group' | 'team'>('group');

    const changeType: ChangeEventHandler<{ name?: string; value: unknown }> = ({ target: { value } }) => {
        setInterviewType(value as 'group' | 'team');
    };

    const sorted =
        interviewType === 'group'
            ? candidateStore.candidates
                  .filter(({ group, step }) => group === userStore.info.group && step === 2)
                  .sort(groupSort)
            : candidateStore.candidates.filter(({ step }) => step === 4).sort(teamSort);

    return !userStore.info.group ||
        !recruitmentStore.recruitments.find(({ title }) => title === recruitmentStore.viewing) ? null : (
        <div className={classes.container}>
            <Recruitment />
            <Table candidates={sorted} changeType={changeType} interviewType={interviewType} />
        </div>
    );
});

export default Data;
