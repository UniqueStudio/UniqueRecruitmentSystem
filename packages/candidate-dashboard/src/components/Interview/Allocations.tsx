import { FormControl, FormGroup, FormLabel } from '@material-ui/core';
import { Application } from '@uniqs/config';
import React, { FC } from 'react';

interface Props {
    application: Partial<Application>;
}

export const Allocations: FC<Props> = ({ application: { interviewAllocations } }) => {
    const group = interviewAllocations?.group;
    const team = interviewAllocations?.team;
    return (
        <form>
            <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>组面时间分配结果</FormLabel>
                <FormGroup>
                    {group
                        ? new Date(group).toLocaleString('zh-CN', {
                              dateStyle: 'full',
                              timeStyle: 'full',
                              timeZone: 'Asia/Shanghai',
                              hour12: false,
                          })
                        : ''}
                </FormGroup>
            </FormControl>
            <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>群面时间分配结果</FormLabel>
                <FormGroup>
                    {team
                        ? new Date(team).toLocaleString('zh-CN', {
                              dateStyle: 'full',
                              timeStyle: 'full',
                              timeZone: 'Asia/Shanghai',
                              hour12: false,
                          })
                        : ''}
                </FormGroup>
            </FormControl>
        </form>
    );
};
