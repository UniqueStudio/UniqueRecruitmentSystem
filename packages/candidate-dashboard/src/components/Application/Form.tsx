import { t, Trans } from '@lingui/macro';
import { Box, Button, DialogActions, DialogContent, IconButton, styled, Tooltip, Typography } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { Application, DEPARTMENTS, GRADES, GROUP_MAP, INSTITUTES, RANKS } from '@uniqs/config';
import { convertRecruitmentName, validateCode } from '@uniqs/utils';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { abandonApplication, createApplication, getCodeForCandidate, setApplication } from '@apis/rest';
import { SplitButton } from '@components/SplitButton';
import { AutoComplete, Input, Select, Upload } from '@components/Textfields';
import { useCountdown } from '@hooks/useCountdown';
import { useAppSelector } from '@stores/index';

type Inputs = Parameters<typeof createApplication>[0];

interface Props {
    application: Partial<Application>;
    onCancel: () => void;
}

const Content = styled(DialogContent)(({ theme: { spacing, breakpoints } }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: spacing(1),
    padding: spacing(3),
    [breakpoints.down('sm')]: {
        padding: spacing(1),
    },
}));

export const Form: FC<Props> = ({
    application: {
        institute = '',
        major = '',
        intro = '',
        isQuick = false,
        referrer = '',
        recruitment,
        grade,
        group,
        rank,
        resume,
        id,
    },
    onCancel,
}) => {
    const [timeLeft, setTimeLeft] = useCountdown();
    const [selected, setSelected] = useState(0);
    const {
        control,
        formState: { isValid, isSubmitting },
        handleSubmit,
        watch,
        setValue,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            institute,
            major,
            intro,
            isQuick,
            referrer,
            group,
            grade,
            rank,
            rid: recruitment?.id,
            code: '',
        },
    });
    const progress = useAppSelector(({ component }) => component.progress);

    const getCode = async () => {
        setTimeLeft(60);
        await getCodeForCandidate();
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (isSubmitting) {
            return;
        }
        if (id) {
            await setApplication(id, data);
        } else {
            await createApplication(data);
        }
    };

    const recruitments = recruitment ? [recruitment] : [];
    const now = new Date();
    const canApply = recruitment && new Date(recruitment.deadline) > now && new Date(recruitment.beginning) < now;
    const ended = recruitment && new Date(recruitment.end) < now;

    const size: 'medium' | 'small' = id ? 'medium' : 'small';
    const props = { control, size, variant: 'outlined' as const };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Content>
                <Box display='grid' gap={1} alignContent='space-between'>
                    <Box display='grid' gridTemplateColumns='2fr minmax(110px, 1fr)' gap={1}>
                        <Select
                            name='rid'
                            selections={recruitments.map(({ id, name }) => ({
                                key: id,
                                value: convertRecruitmentName(name),
                            }))}
                            label={t`招新名称`}
                            disabled
                            {...props}
                        />
                        <Select
                            name='group'
                            selections={[...GROUP_MAP.entries()].map(([key, value]) => ({ key, value }))}
                            label={t`组别`}
                            {...props}
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='2fr minmax(110px, 1fr)' gap={1}>
                        <AutoComplete name='institute' options={INSTITUTES} label={t`学院`} {...props} />
                        <Select
                            name='grade'
                            selections={GRADES.map((value, key) => ({ key, value }))}
                            label={t`年级`}
                            {...props}
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='2fr minmax(110px, 1fr)' gap={1}>
                        <AutoComplete
                            name='major'
                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                            options={DEPARTMENTS[watch('institute')] ?? []}
                            label={t`专业`}
                            {...props}
                        />
                        <Select
                            name='rank'
                            selections={RANKS.map((value, key) => ({ key, value }))}
                            label={t`成绩排名`}
                            {...props}
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='1fr 2fr' gap={1}>
                        <Input
                            name='referrer'
                            rules={{ required: false }}
                            label={t`推荐人`}
                            placeholder='选填'
                            required={false}
                            {...props}
                        />
                        <Upload
                            name='resume'
                            rules={{ required: false }}
                            required={false}
                            label={t`简历`}
                            placeholder='点击按钮选择'
                            value={resume}
                            {...props}
                        />
                    </Box>
                    {!id && (
                        <Box display='grid' gridTemplateColumns='2fr 1fr' gap={1} alignItems='center'>
                            <Input name='code' rules={{ validate: validateCode }} label={t`验证码`} {...props} />
                            <Button onClick={getCode} disabled={!!timeLeft}>
                                {timeLeft ? t`${timeLeft}秒后重新获取` : t`获取验证码`}
                            </Button>
                        </Box>
                    )}
                </Box>
                <Input name='intro' label={t`个人简介`} multiline rows={10} {...props} />
            </Content>
            <DialogActions>
                {id ? (
                    <SplitButton
                        options={[t`更新`, t`放弃`]}
                        onSelect={(index) => {
                            setSelected(index);
                        }}
                    >
                        {
                            [
                                <LoadingButton
                                    key='0'
                                    type='submit'
                                    disabled={!isValid || !canApply}
                                    loading={isSubmitting}
                                    loadingIndicator={`${(progress * 100).toFixed(2)}%`}
                                >
                                    <Trans>更新</Trans>
                                </LoadingButton>,
                                <Button disabled={ended} onClick={() => abandonApplication(id)} key='1'>
                                    <Trans>放弃</Trans>
                                </Button>,
                            ][selected]
                        }
                    </SplitButton>
                ) : (
                    <>
                        {!!selected && (
                            <Tooltip
                                title={
                                    <>
                                        <Typography variant='caption' component='p'>
                                            如字面意思，快速通道比正常通道要快；同时，即使在快速通道被刷，你也可以保底进入熬测。
                                        </Typography>
                                        <Typography variant='caption' component='p'>
                                            任何人都可以享受这种便利，且名不副实的后果微乎其微，但我们相信你有自知之明。
                                        </Typography>
                                        <Typography variant='caption' component='p'>
                                            在勾选该选项前，请先参照各组的要求，思考你的能力与“快速”二字是否匹配。
                                        </Typography>
                                        <Typography variant='caption' component='p'>
                                            如果你感到犹豫不决，不妨咨询我们。
                                        </Typography>
                                    </>
                                }
                            >
                                <IconButton color='primary' size='small' sx={{ marginRight: 1 }}>
                                    <HelpOutline />
                                </IconButton>
                            </Tooltip>
                        )}
                        <SplitButton
                            options={[t`报名`, t`快速通道报名`]}
                            onSelect={(index) => {
                                setSelected(index);
                                setValue('isQuick', !!index);
                            }}
                        >
                            <LoadingButton
                                type='submit'
                                disabled={!isValid || !canApply}
                                loading={isSubmitting}
                                loadingIndicator={`${(progress * 100).toFixed(2)}%`}
                            >
                                {[t`报名`, t`快速通道报名`][selected]}
                            </LoadingButton>
                        </SplitButton>
                    </>
                )}
                <Button onClick={onCancel} color='secondary'>
                    <Trans>取消</Trans>
                </Button>
            </DialogActions>
        </form>
    );
};
