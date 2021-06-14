import { FormControl, FormGroup, FormLabel } from '@material-ui/core';
import { Application, GroupOrTeam, Interview, PERIOD_MAP } from '@uniqs/config';
import React, { FC } from 'react';

interface Props {
    application: Partial<Application>;
}

export const Selections: FC<Props> = ({ application: { interviewSelections = [] } }) => {
    const group: Interview[] = [];
    const team: Interview[] = [];
    for (const selection of interviewSelections) {
        if (selection.name === GroupOrTeam.unique) {
            team.push(selection);
        } else {
            group.push(selection);
        }
    }
    return (
        <form>
            <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>已选择的组面时间段</FormLabel>
                <FormGroup>
                    {group.map(
                        ({ date, period }) =>
                            new Date(date).toLocaleDateString('zh-CN', {
                                dateStyle: 'full',
                            }) + PERIOD_MAP.get(period)!,
                    )}
                </FormGroup>
            </FormControl>
            <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>已选择的群面时间段</FormLabel>
                <FormGroup>
                    {team.map(
                        ({ date, period }) =>
                            new Date(date).toLocaleDateString('zh-CN', {
                                dateStyle: 'full',
                            }) + PERIOD_MAP.get(period)!,
                    )}
                </FormGroup>
            </FormControl>
        </form>
    );
};
