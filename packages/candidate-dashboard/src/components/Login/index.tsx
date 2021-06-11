import { Grid, Link, Typography } from '@material-ui/core';
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
        <Grid
            item
            container
            xs={10}
            spacing={3}
            component='form'
            justifyContent='center'
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid item>
                <Input name='phone' control={control} rules={{ validate: validatePhone }} label='手机号' type='tel' />
            </Grid>
            <Grid item>
                <Input name='password' control={control} label='密码' type='password' />
            </Grid>
            <Grid item>
                <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                    登录
                </LoadingButton>
            </Grid>
            <Grid item xs={10}>
                <Typography variant='caption' color='textSecondary' align='center' component='p'>
                    没有账号？ 立即<Link href='register'>注册</Link>
                </Typography>
            </Grid>
        </Grid>
    );
};
