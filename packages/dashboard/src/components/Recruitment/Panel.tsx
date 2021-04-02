import { Box, Button, Paper, Typography } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { getCandidates } from '@apis/rest';
import { AddOne } from '@components/AddOne';
import { DoughnutChart } from '@components/Chart/DoughnutChart';
import { Modal } from '@components/Modal';
import { GROUP_MAP, STEP_SHORT_MAP } from '@config/consts';
import { Group } from '@config/enums';
import { Recruitment } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/recruitmentPanel';
import { compareTitle } from '@utils/compareTitle';
import { titleConverter } from '@utils/titleConverter';

interface Props {
    recruitment: Recruitment;
}

const RecruitmentOverview: FC<Props> = observer(({ recruitment: { statistics, end, id, name } }) => {
    const classes = useStyles();
    const [group, setGroup] = useState<Group>();
    const { $recruitment, $user, $component } = useStores();
    const result = {} as Record<Group, number[]>;
    let total = 0;
    GROUP_MAP.forEach((_, group) => {
        result[group] = [];
        let sum = 0;
        STEP_SHORT_MAP.forEach((_, key) => {
            const current = statistics?.[group]?.[key] || 0;
            sum += current;
            result[group].push(current);
        });
        total += sum;
        result[group].push(sum);
    });
    const handleSet = () => {
        if (compareTitle($user.info.joinTime, name) >= 0) {
            $component.enqueueSnackbar('你不能查看本次招新', 'info');
            return;
        }
        if ($recruitment.viewingId === id) {
            $component.enqueueSnackbar('你正在查看本次招新', 'info');
            return;
        }
        $component.enqueueSnackbar('设置成功，正在获取候选人信息', 'success');
        return getCandidates(id);
    };
    const data = group ? result[group].slice(0, -1) : Object.values(result).map((t) => t[STEP_SHORT_MAP.size]);
    const title = group ? `${GROUP_MAP.get(group)!}组各轮情况` : titleConverter(name);
    const labels = group ? [...STEP_SHORT_MAP.values()] : [...GROUP_MAP.values()];
    const selected = $recruitment.viewingId === id;
    const EyeIcon = $recruitment.viewingId === id ? VisibilityIcon : VisibilityOffIcon;
    return (
        <Paper
            key={id}
            className={clsx(classes.container, {
                [classes.selected]: selected,
                [classes.expired]: Date.now() > +end,
            })}>
            <Box className={classes.chartContainer}>
                <div className={classes.chart}>
                    <DoughnutChart
                        data={data}
                        title={title}
                        labels={labels}
                        onClick={(event, elements) => {
                            const element = elements[0];
                            if (!element) {
                                return;
                            }
                            setGroup((group) => (group ? undefined : [...GROUP_MAP.keys()][element.index]));
                        }}
                    />
                </div>
                <Typography variant='body1' className={classes.centerText}>
                    总计：{group ? result[group][STEP_SHORT_MAP.size] : total}人
                </Typography>
            </Box>
            <Button onClick={handleSet} fullWidth disabled={selected}>
                <EyeIcon color='inherit' />
                {selected ? '当前招新' : '查看招新'}
            </Button>
        </Paper>
    );
});

export const RecruitmentPanel: FC = observer(() => {
    const classes = useStyles();
    const { $recruitment, $component } = useStores();
    return (
        <Modal
            title='全部招新'
            open={$component.recruitmentPanelOpen}
            onClose={() => $component.toggleRecruitmentPanel()}>
            <div className={classes.blocksContainer}>
                <AddOne />
                {$recruitment.recruitmentsArray.map((recruitment) => (
                    <RecruitmentOverview recruitment={recruitment} key={recruitment.id} />
                ))}
            </div>
        </Modal>
    );
});
