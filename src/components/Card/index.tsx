import React, { ChangeEventHandler, FC, MouseEventHandler, useMemo } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';

import { observer } from 'mobx-react-lite';

import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FlashOn from '@material-ui/icons/FlashOn';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Female from 'mdi-material-ui/GenderFemale';
import Male from 'mdi-material-ui/GenderMale';
import TransGender from 'mdi-material-ui/GenderTransgender';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

import { GRADES, GROUPS, GROUPS_ } from '../../config/consts';
import { Candidate as CandidateType, Evaluation } from '../../config/types';

import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/card';

const getProportion = (evaluations: Evaluation[]) => {
    const good = (evaluations.filter((evaluation) => evaluation === 2).length / evaluations.length) * 100;
    const soSo = (evaluations.filter((evaluation) => evaluation === 1).length / evaluations.length) * 100 + good;
    return { good, soSo };
};

const genderIcons = [
    <TransGender htmlColor={orange[500]} fontSize='small' />,
    <Male htmlColor={blue[500]} fontSize='small' />,
    <Female htmlColor={pink[500]} fontSize='small' />,
];

interface Props {
    candidate: CandidateType;
    index: number;
    isTeamInterview: boolean;
    toggleDetail: () => void;
}

const CandidateCard: FC<Props> = observer(({ candidate, isTeamInterview, index, toggleDetail }) => {
    const { candidateStore, componentStateStore } = useStores();
    const {
        name,
        grade,
        institute,
        comments,
        abandon,
        rejected,
        gender,
        group,
        interviews,
        step,
        _id,
        isQuick,
    } = candidate;
    const {
        team: { allocation },
    } = interviews;
    const evaluations = comments.map(({ evaluation }) => evaluation);

    const { good, soSo } = getProportion(evaluations);
    const classes = useStyles({ disabled: abandon, white: !evaluations.length, good, soSo });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const checked = candidateStore.selected.has(_id);
    const disabled = candidateStore.selected.size !== 0 && componentStateStore.fabOn !== step;

    const handleCheck: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        if (target.checked) {
            candidateStore.selectCandidate(_id);
            componentStateStore.toggleFabOn(step);
        } else {
            candidateStore.deselectCandidate(_id);
        }
    };

    const handleToggle = () => {
        toggleDetail();
        componentStateStore.recordInputtingComment(2, '');
    };

    const stopPropagation: MouseEventHandler = (event) => event.stopPropagation();

    const disableCheck = abandon || rejected || disabled;

    const Check = () => (
        <Checkbox
            color='primary'
            onClick={stopPropagation}
            onChange={handleCheck}
            checked={checked}
            disabled={disableCheck}
        />
    );

    const Profile = () => (
        <span className={classes.cardTitle}>
            <Typography variant='h6'>
                {isTeamInterview ? `${GROUPS[GROUPS_.indexOf(group)]} - ${name}` : name}
                <span className={classes.svg}>
                    {genderIcons[gender]}
                    {isQuick && <FlashOn htmlColor={amber[500]} fontSize='small' />}
                </span>
            </Typography>
            <Typography color='textSecondary' variant='caption' display='block'>
                {`${GRADES[grade]} - ${institute}`}
                {abandon && ' - 已放弃'}
                {rejected && ' - 已淘汰'}
            </Typography>
            {allocation && isTeamInterview && (
                <Typography color='textSecondary' variant='caption' display='block'>
                    {new Date(allocation).toLocaleString('ja-JP', { hour12: false })}
                </Typography>
            )}
        </span>
    );

    const Info = () => (
        <IconButton className={classes.iconButton} onClick={handleToggle}>
            <InfoIcon />
        </IconButton>
    );

    const CardContent = (
        <Card className={classes.card} onClick={handleToggle}>
            <div className={classes.cardContent}>
                {useMemo(Check, [checked, disableCheck])}
                {useMemo(Profile, [isTeamInterview, abandon, rejected, allocation])}
                {useMemo(Info, [classes.iconButton])}
            </div>
        </Card>
    );

    return (
        <Draggable draggableId={_id} index={index} isDragDisabled={abandon || rejected || checked || isMobile}>
            {({ innerRef, draggableProps, dragHandleProps }: DraggableProvided) => (
                <div ref={innerRef} className={classes.cardContainer} {...draggableProps} {...dragHandleProps}>
                    {CardContent}
                </div>
            )}
        </Draggable>
    );
});

export default CandidateCard;
