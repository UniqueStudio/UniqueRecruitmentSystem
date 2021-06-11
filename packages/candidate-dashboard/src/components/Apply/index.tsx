import { Box, Tooltip, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { DEPARTMENTS, Grade, GRADES, Group, GROUP_MAP, INSTITUTES, Rank, RANKS } from '@uniqs/config';
import { convertRecruitmentName } from '@uniqs/utils';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { createApplication, getPendingRecruitments } from '@apis/rest';
import { AutoComplete, CheckBox, Input, Select, Upload } from '@components/Textfields';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { useAppSelector } from '@stores/index';

type Inputs = Parameters<typeof createApplication>[0];

interface Props {
    defaultValues?: Partial<Inputs>;
}

export const Apply: FC<Props> = ({ defaultValues }) => {
    const {
        control,
        formState: { isValid, isSubmitting },
        handleSubmit,
        watch,
    } = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            institute: '',
            major: '',
            grade: Grade.freshman,
            rank: Rank.A,
            group: Group.web,
            intro: '',
            isQuick: false,
            referrer: '',
            rid: '',
            ...defaultValues,
        },
    });
    const recruitments = useAppSelector(({ recruitment }) => recruitment.recruitments);
    const progress = useAppSelector(({ component }) => component.progress);

    useAsyncEffect(async () => {
        await getPendingRecruitments();
    }, []);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (isSubmitting) {
            return;
        }
        await createApplication(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box
                display='grid'
                gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))'
                gap={1}
            >
                <Box display='grid' gap={1}>
                    <Box display='grid' gridTemplateColumns='minmax(auto, 300px) auto' gap={1}>
                        <Select
                            name='rid'
                            control={control}
                            selections={recruitments.map(({ id, name }) => ({
                                key: id,
                                value: convertRecruitmentName(name),
                            }))}
                            label='招新名称'
                            variant='outlined'
                        />
                        <Select
                            name='group'
                            control={control}
                            selections={[...GROUP_MAP.entries()].map(([key, value]) => ({ key, value }))}
                            label='组别'
                            variant='outlined'
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='minmax(auto, 300px) auto' gap={1}>
                        <AutoComplete
                            name='institute'
                            control={control}
                            options={INSTITUTES}
                            label='学院'
                            variant='outlined'
                        />
                        <Select
                            name='grade'
                            control={control}
                            selections={GRADES.map((value, key) => ({ key, value }))}
                            label='年级'
                            variant='outlined'
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='minmax(auto, 300px) auto' gap={1}>
                        <AutoComplete
                            name='major'
                            control={control}
                            options={DEPARTMENTS[watch('institute')] ?? []}
                            label='专业'
                            variant='outlined'
                        />
                        <Select
                            name='grade'
                            control={control}
                            selections={RANKS.map((value, key) => ({ key, value }))}
                            label='成绩排名'
                            variant='outlined'
                        />
                    </Box>
                    <Box display='grid' gridTemplateColumns='auto auto auto' gap={1}>
                        <Input
                            name='referrer'
                            rules={{ required: false }}
                            control={control}
                            label='推荐人'
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
                                <CheckBox name='isQuick' control={control} label='快速通道' />
                            </div>
                        </Tooltip>
                        <Upload name='resume' control={control} rules={{ required: false }} label='选择简历' />
                    </Box>
                </Box>
                <Input name='intro' control={control} label='个人简介' multiline rows={9} variant='outlined' fullWidth />
            </Box>
            <LoadingButton
                type='submit'
                disabled={!isValid}
                loading={isSubmitting}
                loadingIndicator={`${(progress * 100).toFixed(2)}%`}
            >
                提交
            </LoadingButton>
        </form>
    );
};
