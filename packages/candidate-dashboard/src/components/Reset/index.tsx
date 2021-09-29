import { t, Trans } from '@lingui/macro';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack } from '@mui/material';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { getCodeForOther, resetPassword } from '@apis/rest';
import { Input, Password } from '@components/Textfields';
import { useCountdown } from '@hooks/useCountdown';
import { validateCode, validatePhone } from '@uniqs/utils';

interface Inputs {
    phone: string;
    code: string;
    password: string;
}

export const Reset: FC = () => {
    const [timeLeft, setTimeLeft] = useCountdown();
    const history = useHistory();
    const {
        control,
        formState: { isValid, isSubmitting, errors },
        handleSubmit,
        watch,
        setValue,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            phone: '',
            code: '',
            password: '',
        },
    });

    const getCode = async () => {
        setTimeLeft(60);
        await getCodeForOther(watch('phone'));
    };

    const submit: SubmitHandler<Inputs> = async ({ phone, password, code }) => {
        if (isSubmitting) {
            return;
        }
        if (await resetPassword({ phone, password, code })) {
            history.push('login');
        } else {
            setValue('code', '');
        }
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
            <Box display='grid' gridTemplateColumns='2fr auto' gap={1} alignItems='center'>
                <Input name='code' control={control} rules={{ validate: validateCode }} label={t`验证码`} />
                <Button onClick={getCode} disabled={!!timeLeft || !watch('phone') || !!errors.phone}>
                    {timeLeft ? t`${timeLeft}秒后重新获取` : t`获取验证码`}
                </Button>
            </Box>
            <Password name='password' control={control} label={t`密码`} fullWidth />
            <LoadingButton variant='contained' type='submit' disabled={!isValid} loading={isSubmitting}>
                <Trans>重置</Trans>
            </LoadingButton>
        </Stack>
    );
};
