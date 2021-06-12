import { t, Trans } from '@lingui/macro';
import { Box, Button, DialogActions, DialogContent, Tooltip, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Application, DEPARTMENTS, GRADES, GROUP_MAP, INSTITUTES, RANKS } from '@uniqs/config';
import { convertRecruitmentName } from '@uniqs/utils';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { createApplication } from '@apis/rest';
import { AutoComplete, CheckBox, Input, Select, Upload } from '@components/Textfields';
import { useAppSelector } from '@stores/index';

type Inputs = Parameters<typeof createApplication>[0];

interface Props {
    application?: Partial<Application>;
    onCancel: () => void;
}

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
    } = {},
    onCancel,
}) => {
    const {
        control,
        formState: { isValid, isSubmitting },
        handleSubmit,
        watch,
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
        },
    });
    const progress = useAppSelector(({ component }) => component.progress);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (isSubmitting) {
            return;
        }
        await createApplication(data);
    };

    const recruitments = recruitment ? [recruitment] : [];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 1,
                }}
            >
                <Box display='grid' gap={1}>
                    <Box display='grid' gridTemplateColumns='2fr minmax(110px, 1fr)' gap={1}>
                        <Select
                            name='rid'
                            control={control}
                            selections={recruitments.map(({ id, name }) => ({
                                key: id,
                                value: convertRecruitmentName(name),
                            }))}
                            label={t`招新名称`}
                            variant='outlined'
                            disabled
                        />
                        <Select
                            name='group'
                            control={control}
                            selections={[...GROUP_MAP.entries()].map(([key, value]) => ({ key, value }))}
                            label={t`组别`}
                            variant='outlined'
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='2fr minmax(110px, 1fr)' gap={1}>
                        <AutoComplete
                            name='institute'
                            control={control}
                            options={INSTITUTES}
                            label={t`学院`}
                            variant='outlined'
                        />
                        <Select
                            name='grade'
                            control={control}
                            selections={GRADES.map((value, key) => ({ key, value }))}
                            label={t`年级`}
                            variant='outlined'
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='2fr minmax(110px, 1fr)' gap={1}>
                        <AutoComplete
                            name='major'
                            control={control}
                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                            options={DEPARTMENTS[watch('institute')] ?? []}
                            label={t`专业`}
                            variant='outlined'
                        />
                        <Select
                            name='rank'
                            control={control}
                            selections={RANKS.map((value, key) => ({ key, value }))}
                            label={t`成绩排名`}
                            variant='outlined'
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='auto auto auto' gap={1}>
                        <Input
                            name='referrer'
                            rules={{ required: false }}
                            control={control}
                            label={t`推荐人`}
                            variant='outlined'
                        />
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
                            <div>
                                <CheckBox name='isQuick' control={control} label={t`快速通道`} />
                            </div>
                        </Tooltip>
                        <Upload name='resume' control={control} rules={{ required: false }} label={t`选择简历`} />
                    </Box>
                </Box>
                <Input
                    name='intro'
                    control={control}
                    label={t`个人简介`}
                    multiline
                    rows={9}
                    variant='outlined'
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    type='submit'
                    disabled={!isValid}
                    loading={isSubmitting}
                    loadingIndicator={`${(progress * 100).toFixed(2)}%`}
                >
                    <Trans>提交</Trans>
                </LoadingButton>
                <Button onClick={onCancel}><Trans>取消</Trans></Button>
            </DialogActions>
        </form>
    );
};
