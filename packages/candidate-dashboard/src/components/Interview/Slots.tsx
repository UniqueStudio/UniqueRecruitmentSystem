import { Trans } from '@lingui/macro';
import { FormControl, FormGroup, FormLabel } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Interview, InterviewType, PERIOD_MAP } from '@uniqs/config';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CheckBox } from '@components/Textfields';

interface Props {
    slots: Interview[];
    type: InterviewType;
}

interface Inputs {
    slots: Record<string, string>;
}

export const Slots: FC<Props> = ({ slots, type }) => {
    const {
        control,
        formState: { isValid, isSubmitting },
        handleSubmit,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            slots: {},
        },
    });

    const submit = () => {
        // TODO
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>
                    可供选择的{type === InterviewType.group ? '组面' : '群面'}时间段
                </FormLabel>
                <FormGroup>
                    {slots.map(({ date, id, period }) => (
                        <CheckBox
                            key={id}
                            control={control}
                            name={`slots.${id}`}
                            label={
                                new Date(date).toLocaleDateString('zh-CN', {
                                    dateStyle: 'full',
                                }) + PERIOD_MAP.get(period)!
                            }
                        />
                    ))}
                </FormGroup>
            </FormControl>
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>提交</Trans>
            </LoadingButton>
        </form>
    );
};
