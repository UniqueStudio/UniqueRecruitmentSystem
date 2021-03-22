import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import Recruitment from '../components/Recruitment';
import Table from '../components/Table';
import { useStores } from '../hooks/useStores';
import useStyles from '../styles/data';
import { groupSort, teamSort } from '../utils/sortBySlot';

const Data: FC = observer(() => {
    const { $candidate, $user, $recruitment } = useStores();
    const classes = useStyles();
    const [interviewType, setInterviewType] = useState<'group' | 'team'>('group');

    const changeType: ChangeEventHandler<{ name?: string; value: unknown }> = ({ target: { value } }) => {
        setInterviewType(value as 'group' | 'team');
    };

    const sorted =
        interviewType === 'group'
            ? $candidate.candidates
                  .filter(({ group, step }) => group === $user.info.group && step === 2)
                  .sort(groupSort)
            : $candidate.candidates.filter(({ step }) => step === 4).sort(teamSort);

    return !$user.info.group ||
        !$recruitment.recruitments.find(({ title }) => title === $recruitment.viewing) ? null : (
        <div className={classes.container}>
            <Recruitment />
            <Table candidates={sorted} changeType={changeType} interviewType={interviewType} />
        </div>
    );
});

export default Data;
