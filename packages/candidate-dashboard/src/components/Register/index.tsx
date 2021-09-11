import { t, Trans } from '@lingui/macro';
import { Box, Button, Link, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Gender, GENDERS } from '@uniqs/config';
import { validateCode, validateMail, validatePhone } from '@uniqs/utils';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { createCandidate, getCodeForOther } from '@apis/rest';
import { Input, Select, Password } from '@components/Textfields';
import { useCountdown } from '@hooks/useCountdown';

interface Inputs {
    name: string;
    gender: Gender;
    phone: string;
    mail: string;
    code: string;
    password: string;
}

export const Register = () => {
    const [timeLeft, setTimeLeft] = useCountdown();
    const history = useHistory();
    const {
        control,
        watch,
        formState: { isValid, isSubmitting, errors },
        handleSubmit,
        setValue,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            phone: '',
            mail: '',
            code: '',
            password: '',
        },
    });

    const getCode = async () => {
        setTimeLeft(60);
        await getCodeForOther(watch('phone'));
    };

    const submit: SubmitHandler<Inputs> = async ({ phone, password, name, code, gender, mail }) => {
        if (isSubmitting) {
            return;
        }
        if (await createCandidate({ phone, password, name, code, gender, mail })) {
            history.push('login');
        } else {
            setValue('code', '');
        }
    };

    return (
        <Stack spacing={2} component='form' alignItems='center' maxWidth='75%' onSubmit={handleSubmit(submit)}>
            <Box display='grid' gridTemplateColumns='2fr 1fr' gap={1}>
                <Input name='name' control={control} label='姓名' />
                <Select
                    name='gender'
                    control={control}
                    selections={GENDERS.map((value, key) => ({ key, value }))}
                    label={t`性别`}
                />
            </Box>
            <Input
                name='mail'
                control={control}
                rules={{ validate: validateMail }}
                label={t`邮箱`}
                type='email'
                fullWidth
            />
            <Input
                name='phone'
                control={control}
                rules={{ validate: validatePhone }}
                label={t`手机号`}
                type='tel'
                fullWidth
            />
            <Box display='grid' gridTemplateColumns='2fr auto' gap={1} alignItems='center'>
                <Input name='code' control={control} rules={{ validate: validateCode }} label={t`验证码`} />
                <Button onClick={getCode} disabled={!!timeLeft || !watch('phone') || !!errors.phone}>
                    {timeLeft ? t`${timeLeft}秒后重新获取` : t`获取验证码`}
                </Button>
            </Box>
            <Password name='password' control={control} label={t`密码`} fullWidth />
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>注册</Trans>
            </LoadingButton>
            <Typography variant='caption' color='textSecondary'>
                <Trans>
                    已有账号？ 立即
                    <Link component={RouterLink} to='login'>
                        登录
                    </Link>
                </Trans>
            </Typography>
        </Stack>
    );
};
