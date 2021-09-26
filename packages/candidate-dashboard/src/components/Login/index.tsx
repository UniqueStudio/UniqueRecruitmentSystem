import { t, Trans } from '@lingui/macro';
import { Link, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

import { loginByPassword } from '@apis/rest';
import { Input, Password } from '@components/Textfields';
import { validatePhone } from '@uniqs/utils';

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

    const submit: SubmitHandler<Inputs> = async ({ phone, password }) => {
        if (isSubmitting) {
            return;
        }
        await loginByPassword(phone, password);
    };

    return (
        <Stack spacing={2} component='form' alignItems='center' maxWidth='75%' onSubmit={handleSubmit(submit)}>
            <Input
                name='phone'
                control={control}
                rules={{ validate: validatePhone }}
                label={t`手机号`}
                type='tel'
                fullWidth
            />
            <Password name='password' control={control} label={t`密码`} fullWidth />
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>登录</Trans>
            </LoadingButton>
            <Stack alignItems='center'>
                <Typography variant='caption' color='textSecondary'>
                    <Trans>
                        没有账号？ 立即
                        <Link component={RouterLink} to='register'>
                            注册
                        </Link>
                    </Trans>
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                    <Trans>
                        不知道/忘记密码？立即
                        <Link component={RouterLink} to='reset'>
                            重置
                        </Link>
                    </Trans>
                </Typography>
            </Stack>
        </Stack>
    );
};
