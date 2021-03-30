import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import RemoveIcon from 'mdi-material-ui/AccountRemove';
import ArrowLeftBoldIcon from 'mdi-material-ui/ArrowLeftBold';
import ArrowRightBoldIcon from 'mdi-material-ui/ArrowRightBold';
import CloseIcon from 'mdi-material-ui/EyeOff';
import SelectAllIcon from 'mdi-material-ui/SelectAll';
import SelectInverseIcon from 'mdi-material-ui/SelectInverse';
import SendIcon from 'mdi-material-ui/Send';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { moveCandidate } from '@apis/rest';
import { Step, StepType } from '@config/enums';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/fab';

const ButtonGenerator = (content: string, icon: JSX.Element, onClick: () => void, disabled = false) => (
    <SpeedDialAction icon={icon} FabProps={{ disabled }} tooltipTitle={content} onClick={onClick} />
);

interface Props {
    candidates: Candidate[];
    toggleOpen: (component: string) => () => void;
}

// TODO: fixme
export const Fab: FC<Props> = observer(({ candidates, toggleOpen }) => {
    const { $component, $candidate, $user } = useStores();
    const classes = useStyles();
    const [fabOpen, setFabOpen] = useState(false);

    const handleSelectAll = (all: string[]) => () => {
        $candidate.selectMany(all.filter((cid) => selectable(cid)));
    };

    const handleInverse = (all: string[], toDeselect: string[]) => () => {
        $candidate.deselectMany(toDeselect.filter((cid) => selectable(cid)));
        $candidate.selectMany(all.filter((cid) => !toDeselect.includes(cid) && selectable(cid)));
    };

    const selectable = (cid: string) => {
        const candidate = candidates.find(({ id }) => id === cid);
        return candidate && !(candidate.abandoned || candidate.rejected);
    };

    const hideFab = () => {
        $candidate.deselectAll();
        $component.toggleFabOff();
    };

    const sendNotification = () => {
        toggleOpen('modal')();
        toggleFabButtons();
    };

    const confirmRemove = () => {
        toggleOpen('dialog')();
        toggleFabButtons();
    };

    const toggleFabButtons = () => {
        setFabOpen((prevFabOpen) => !prevFabOpen);
    };

    const openFab = () => {
        setFabOpen(true);
    };

    const closeFab = () => {
        setFabOpen(false);
    };

    const changeProcess = (dir: 'prev' | 'next') => () => {
        if ($candidate.selected.size === 0) return;
        $candidate.selected.forEach(({ id, step }) => {
            const to = ((dir === 'prev' ? -1 : +1) + step) as Step;
            if (to < Step.报名 || to > Step.通过) {
                return;
            }
            void moveCandidate(id, step, to);
        });
        $candidate.deselectAll();
    };

    const ids = candidates.map(({ id }) => id);
    const selectedInColumn = [...$candidate.selected.keys()].filter((cid) => ids.includes(cid));
    const enabled =
        selectedInColumn.length &&
        ($user.info.isCaptain ||
            ($candidate.stepType === StepType.interview
                ? $user.info.isCaptain
                : $candidate.group === $user.info.group));
    return (
        <SpeedDial
            ariaLabel='fab'
            className={classes.fab}
            hidden={$component.fabOn === -1}
            icon={<SpeedDialIcon />}
            onBlur={closeFab}
            onClick={toggleFabButtons}
            onClose={closeFab}
            onFocus={openFab}
            onMouseEnter={openFab}
            onMouseLeave={closeFab}
            open={fabOpen}>
            {ButtonGenerator('隐藏Fab', <CloseIcon />, hideFab)}
            {ButtonGenerator('移除', <RemoveIcon />, confirmRemove, !enabled)}
            {ButtonGenerator('下一流程', <ArrowRightBoldIcon />, changeProcess('next'), !enabled)}
            {ButtonGenerator('上一流程', <ArrowLeftBoldIcon />, changeProcess('prev'), !enabled)}
            {ButtonGenerator('发送通知', <SendIcon />, sendNotification, !enabled)}
            {ButtonGenerator('反选', <SelectInverseIcon />, handleInverse(ids, selectedInColumn))}
            {ButtonGenerator('全选', <SelectAllIcon />, handleSelectAll(ids))}
        </SpeedDial>
    );
});
