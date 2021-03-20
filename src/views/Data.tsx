import React, { ChangeEventHandler, FC, memo, useState } from 'react';

import { Props } from '../containers/Data';
import Recruitment from '../containers/Recruitment';
import Table from '../containers/Table';

import useStyles from '../styles/data';

import { groupSort, teamSort } from '../utils/sortBySlot';

const Data: FC<Props> = memo(({ recruitment, userGroup, candidates }) => {
    const classes = useStyles();
    const [interviewType, setInterviewType] = useState<'group' | 'team'>('group');

    const changeType: ChangeEventHandler<{ name?: string; value: unknown }> = ({ target: { value } }) => {
        setInterviewType(value as 'group' | 'team');
    };

    const sorted =
        interviewType === 'group'
            ? candidates.filter(({ group, step }) => group === userGroup && step === 2).sort(groupSort)
            : candidates.filter(({ step }) => step === 4).sort(teamSort);

    return !userGroup || !recruitment ? null : (
        <div className={classes.container}>
            <Recruitment />
            <Table candidates={sorted} changeType={changeType} interviewType={interviewType} />
        </div>
    );
});

export default Data;
