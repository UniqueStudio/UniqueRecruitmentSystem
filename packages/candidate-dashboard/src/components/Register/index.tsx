import { t, Trans } from '@lingui/macro';
import { Button, Link, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Gender, GENDERS } from '@uniqs/config';
import { validateCode, validateMail, validatePhone } from '@uniqs/utils';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { createCandidate, getVerificationCode } from '@apis/rest';
import { Input } from '@components/Textfields/Input';
import { Select } from '@components/Textfields/Select';

interface Inputs {
    name: string;
    gender: Gender;
    phone: string;
    mail: string;
    code: string;
    password: string;
    confirmPassword: string;
}

export const Register = () => {
    const [timeLeft, setTimeLeft] = useState(0);
    const {
        control,
        watch,
        formState: { isValid, isSubmitting, errors },
        handleSubmit,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            phone: '',
            mail: '',
            code: '',
            password: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        if (!timeLeft) return;
        const timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const getCode = async () => {
        setTimeLeft(60);
        await getVerificationCode(watch('phone'));
    };

    const submit: SubmitHandler<Inputs> = async ({ phone, password, name, code, gender, mail }) => {
        if (isSubmitting) {
            return;
        }
        await createCandidate({ phone, password, name, code, gender, mail });
    };

    return (
        <Stack spacing={2} component='form' alignItems='center' onSubmit={handleSubmit(submit)}>
            <Input name='name' control={control} label='姓名' />
            <Select
                name='gender'
                control={control}
                selections={GENDERS.map((value, key) => ({ key, value }))}
                label={t`性别`}
            />
            <Input name='phone' control={control} rules={{ validate: validatePhone }} label={t`手机号`} type='tel' />
            <Input name='code' control={control} rules={{ validate: validateCode }} label={t`验证码`} />
            <Button onClick={getCode} disabled={!!timeLeft || !watch('phone') || !!errors.phone}>
                {timeLeft ? t`${timeLeft}秒后重新获取` : t`获取验证码`}
            </Button>
            <Input name='mail' control={control} rules={{ validate: validateMail }} label={t`邮箱`} type='email' />
            <Input name='password' control={control} label={t`密码`} type='password' />
            <Input
                name='confirmPassword'
                control={control}
                rules={{ validate: (value) => value === watch('password') }}
                label={t`重复密码`}
                type='password'
            />
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>注册</Trans>
            </LoadingButton>
            <Typography variant='caption' color='textSecondary'>
                <Trans>
                    已有账号？ 立即<Link href='login'>登录</Link>
                </Trans>
            </Typography>
        </Stack>
    );
};
