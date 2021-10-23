import { HelpOutline } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React, { FC, useState } from 'react';

import { getSlots, selectInterview } from '@apis/rest';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { useAppSelector } from '@stores/index';
import { Application, GroupOrTeam, Interview, InterviewType, PERIOD_MAP, Step } from '@uniqs/config';

interface Props {
    application: Application;
}

const formatDate = ({ id, date, period }: Interview): [string, string] => [
    id,
    new Date(date).toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
    }) + PERIOD_MAP.get(period)!,
];

const GridList = styled(List)({
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    columnGap: 1,
});

export const Selections: FC<Props> = ({ application }) => {
    const [ok, setOk] = useState(false);
    const { id, step, group, interviewSelections } = application;
    const type =
        step === Step.组面时间选择 ? InterviewType.group : step === Step.群面时间选择 ? InterviewType.team : undefined;
    const name =
        step === Step.组面时间选择 ? GroupOrTeam[group] : step === Step.群面时间选择 ? GroupOrTeam.unique : undefined;
    const slots = useAppSelector(({ recruitment }) => recruitment.interviews);

    const [checked, setChecked] = useState<string[]>(() =>
        interviewSelections.filter((interview) => interview.name === name).map(({ id }) => id),
    );
    const [confirmed, setConfirmed] = useState(!!checked.length);

    const handleToggle = (id: string) => () => {
        if (!type || confirmed) {
            return;
        }
        const currentIndex = checked.indexOf(id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleSubmit = async () => {
        if (!type) {
            return;
        }
        await selectInterview(id, type, checked);
        setConfirmed(true);
    };

    const handleEdit = () => void setConfirmed(false);

    useAsyncEffect(async () => {
        if (type) {
            await getSlots(id, type);
            setOk(true);
        }
    }, [id, type]);

    return (
        <Stack sx={{ width: '100%' }} spacing={1} alignItems='start'>
            <Typography fontWeight='bolder'>
                面试时间段选择
                {type === InterviewType.group && '（组面）'}
                {type === InterviewType.team && '（群面）'}
                <Tooltip
                    title={
                        <>
                            <Typography variant='caption' component='p'>
                                恭喜你进入面试环节！
                            </Typography>
                            <Typography variant='caption' component='p'>
                                我们会根据我们的时间安排，设置一定的面试时间供你选择。
                            </Typography>
                            <Typography variant='caption' component='p'>
                                请放心进行选择，在确定面试时间前，你随时可以对选择的时间段进行修改。
                            </Typography>
                            <Typography variant='caption' component='p'>
                                在面试时间确定后，如果你还需要修改面试时间，请及时与我们联系！
                            </Typography>
                        </>
                    }
                >
                    <IconButton color='primary' size='small'>
                        <HelpOutline />
                    </IconButton>
                </Tooltip>
                <Typography variant='subtitle2'>
                    请尽可能多地选择你可以参加面试的时间，我们将统一进行分配，并在确定后通知你
                </Typography>
            </Typography>
            {ok && (
                <GridList dense>
                    {slots.map(formatDate).map(([id, date]) => (
                        <ListItem
                            key={id}
                            secondaryAction={
                                <Checkbox
                                    edge='end'
                                    disabled={confirmed}
                                    checked={checked.includes(id)}
                                    onChange={handleToggle(id)}
                                />
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={handleToggle(id)}>
                                <ListItemText primary={date} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button disabled={!ok} onClick={confirmed ? handleEdit : handleSubmit}>
                            {confirmed ? '修改' : '确认'}
                        </Button>
                    </ListItem>
                </GridList>
            )}

            {!type && <Typography>当前无需选择</Typography>}
        </Stack>
    );
};
