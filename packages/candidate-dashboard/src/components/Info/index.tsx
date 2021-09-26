import { t, Trans } from '@lingui/macro';
import { Box, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { setMyInfo } from '@apis/rest';
import { Select, Input, Password } from '@components/Textfields';
import { useAppSelector } from '@stores/index';
import { Candidate, GENDERS } from '@uniqs/config';
import { validateMail, validatePhone } from '@uniqs/utils';

type Inputs = Pick<Candidate, 'name' | 'gender' | 'phone' | 'mail' | 'password'>;

interface Props {
    info: Inputs;
}

const Form: FC<Props> = ({ info: { name, phone, mail, gender } }) => {
    const {
        control,
        formState: { isValid, isSubmitting },
        handleSubmit,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            name,
            phone,
            mail,
            gender,
            password: '',
        },
    });

    const submit: SubmitHandler<Candidate> = async ({ phone, password, mail }) => {
        if (isSubmitting) {
            return;
        }
        await setMyInfo({ phone, password, mail });
    };

    return (
        <Stack spacing={2} component='form' alignItems='center' mx='auto' onSubmit={handleSubmit(submit)}>
            <Box display='grid' gridTemplateColumns='2fr 1fr' gap={1}>
                <Input name='name' control={control} label='姓名' disabled variant='outlined' />
                <Select
                    name='gender'
                    control={control}
                    selections={GENDERS.map((value, key) => ({ key, value }))}
                    label={t`性别`}
                    disabled
                    variant='outlined'
                />
            </Box>
            <Input
                name='mail'
                control={control}
                rules={{ validate: validateMail }}
                label={t`邮箱`}
                type='email'
                fullWidth
                variant='outlined'
            />
            <Input
                name='phone'
                control={control}
                rules={{ validate: validatePhone }}
                label={t`手机号`}
                type='tel'
                fullWidth
                variant='outlined'
            />
            <Password
                name='password'
                control={control}
                label={t`密码`}
                fullWidth
                rules={{ required: false }}
                required={false}
                variant='outlined'
            />
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>更新信息</Trans>
            </LoadingButton>
        </Stack>
    );
};

export const Info: FC = () => {
    const info = useAppSelector(({ candidate }) => candidate.info);

    return info ? <Form info={info} /> : null;
};
