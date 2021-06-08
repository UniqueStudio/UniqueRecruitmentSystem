import { Card as MuiCard, Checkbox, IconButton, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { amber, blue, orange, pink } from '@material-ui/core/colors';
import FlashOn from '@material-ui/icons/FlashOn';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';

import { Female, Male, TransGender } from '@components/Icons';
import { GRADES, GROUP_MAP } from '@config/consts';
import { Evaluation, StepType } from '@config/enums';
import { Application } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/card';

const getProportion = (evaluations: Evaluation[]) => {
    let good = 0;
    let fair = 0;
    for (const evaluation of evaluations) {
        if (evaluation === Evaluation.good) {
            good += 100;
        } else if (evaluation === Evaluation.fair) {
            fair += 100;
        }
    }
    good /= evaluations.length;
    fair = fair / evaluations.length + good;
    return { good, fair };
};

const genderIcons = {
    0: <TransGender htmlColor={orange[500]} fontSize='small' />,
    1: <Male htmlColor={blue[500]} fontSize='small' />,
    2: <Female htmlColor={pink[500]} fontSize='small' />,
};

interface Props {
    application: Application;
    index: number;
    toggleDetail: () => void;
}

export const Card: FC<Props> = observer(({ application, index, toggleDetail }) => {
    const { $application, $component } = useStores();
    const {
        candidate: { name, gender },
        grade,
        institute,
        comments,
        abandoned,
        rejected,
        group,
        interviewAllocations,
        step,
        id,
        isQuick,
    } = application;
    const evaluations = comments.map(({ evaluation }) => evaluation);

    const { good, fair } = getProportion(evaluations);
    const classes = useStyles({ disabled: abandoned, white: !evaluations.length, good, fair });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const checked = $application.selected.has(id);
    const disabled = $application.selected.size !== 0 && $component.fabOn !== step;

    const handleCheck: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        if (target.checked) {
            $application.selectOne(id);
            $component.setFabOn(step);
        } else {
            $application.deselectOne(id);
        }
    };

    const handleToggle = () => {
        toggleDetail();
        $component.recordInputtingComment(Evaluation.fair, '');
    };

    const stopPropagation: MouseEventHandler = (event) => event.stopPropagation();

    const Check = (
        <Checkbox
            onClick={stopPropagation}
            onChange={handleCheck}
            checked={checked}
            disabled={abandoned || rejected || disabled || $application.stepType === StepType.teamInterview}
        />
    );

    const Profile = (
        <span className={classes.cardTitle}>
            <Typography variant='h6'>
                {$application.stepType === StepType.teamInterview ? `${GROUP_MAP.get(group)!} - ${name}` : name}
                <span className={classes.svg}>
                    {genderIcons[gender]}
                    {isQuick && <FlashOn htmlColor={amber[500]} fontSize='small' />}
                </span>
            </Typography>
            <Typography color='textSecondary' variant='caption' display='block'>
                {`${GRADES[grade]} - ${institute}`}
                {abandoned && ' - 已放弃'}
                {rejected && ' - 已淘汰'}
            </Typography>
            <Typography color='textSecondary' variant='caption' display='block'>
                {$application.stepType === StepType.groupInterview &&
                    interviewAllocations.group?.toLocaleString('zh-CN')}
                {$application.stepType === StepType.teamInterview && interviewAllocations.team?.toLocaleString('zh-CN')}
            </Typography>
        </span>
    );

    const Info = (
        <IconButton className={classes.iconButton} onClick={handleToggle}>
            <InfoIcon />
        </IconButton>
    );

    const CardContent = (
        <MuiCard className={classes.card} onClick={handleToggle}>
            <div className={classes.cardContent}>
                {Check}
                {Profile}
                {Info}
            </div>
        </MuiCard>
    );

    return (
        <Draggable draggableId={id} index={index} isDragDisabled={abandoned || rejected || checked || isMobile}>
            {({ innerRef, draggableProps, dragHandleProps }: DraggableProvided) => (
                <div ref={innerRef} className={classes.cardContainer} {...draggableProps} {...dragHandleProps}>
                    {CardContent}
                </div>
            )}
        </Draggable>
    );
});
