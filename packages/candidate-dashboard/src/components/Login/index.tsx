import { t, Trans } from '@lingui/macro';
import { Link, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { validatePhone } from '@uniqs/utils';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { loginByPassword } from '@apis/rest';
import { Input } from '@components/Textfields/Input';

interface Inputs {
    phone: string;
    password: string;
}

export const Login: FC = () => {
    const {
        control,
        formState: { isValid, isSubmitting },
        handleSubmit,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            phone: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<Inputs> = async ({ phone, password }) => {
        if (isSubmitting) {
            return;
        }
        await loginByPassword(phone, password);
    };

    return (
        <Stack spacing={2} component='form' alignItems='center' onSubmit={handleSubmit(onSubmit)}>
            <Input name='phone' control={control} rules={{ validate: validatePhone }} label={t`手机号`} type='tel' />
            <Input name='password' control={control} label={t`密码`} type='password' />
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>登录</Trans>
            </LoadingButton>
            <Typography variant='caption' color='textSecondary'>
                <Trans>
                    没有账号？ 立即<Link href='register'>注册</Link>
                </Trans>
            </Typography>
        </Stack>
    );
};
