import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import RemoveIcon from 'mdi-material-ui/AccountRemove';
import ArrowLeftBoldIcon from 'mdi-material-ui/ArrowLeftBold';
import ArrowRightBoldIcon from 'mdi-material-ui/ArrowRightBold';
import CloseIcon from 'mdi-material-ui/EyeOff';
import SelectAllIcon from 'mdi-material-ui/SelectAll';
import SelectInverseIcon from 'mdi-material-ui/SelectInverse';
import SendIcon from 'mdi-material-ui/Send';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';

import { moveCandidate } from '@apis/websocket';
import { Candidate, Step } from '@config/types';
import { usePrevious } from '@hooks/usePrevious';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/fab';

const ButtonGenerator = (content: string, icon: JSX.Element, onClick: () => void, disabled = false) => (
    <SpeedDialAction icon={icon} FabProps={{ disabled }} tooltipTitle={content} onClick={onClick} />
);

interface Props {
    candidates: Candidate[];
    toggleOpen: (component: string) => () => void;
}

const FabButton: FC<Props> = observer(({ candidates, toggleOpen }) => {
    const { $component, $candidate, $user } = useStores();
    const classes = useStyles();
    const [fabOpen, setFabOpen] = useState(false);

    const prevGroup = usePrevious($candidate.group);
    const prevSelected = usePrevious($candidate.selected);
    const prevSteps = usePrevious($candidate.steps);

    const handleSelectAll = (all: string[]) => () => {
        $candidate.selectCandidates(all.filter((cid) => selectable(cid)));
    };

    const handleInverse = (all: string[], toDeselect: string[]) => () => {
        $candidate.deselectCandidates(toDeselect.filter((cid) => selectable(cid)));
        $candidate.selectCandidates(all.filter((cid) => !toDeselect.includes(cid) && selectable(cid)));
    };

    const selectable = (cid: string) => {
        const candidate = candidates.find(({ _id }) => _id === cid);
        return candidate && !(candidate.abandon || candidate.rejected);
    };

    const hideFab = () => {
        $candidate.deselectAll();
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
        $candidate.selected.forEach(({ _id, step }) => {
            const to = ((dir === 'prev' ? -1 : +1) + step) as Step;
            if (to < 0 || to > 5) {
                return;
            }
            moveCandidate(_id, step, to);
        });
        $candidate.deselectAll();
    };

    useEffect(() => {
        if (prevSelected !== undefined && prevSteps !== undefined && prevGroup !== undefined) {
            if (prevSelected.size !== 0 && $candidate.selected.size === 0) {
                $component.toggleFabOff();
                closeFab();
            }
            if (prevGroup !== $candidate.group || prevSteps.length !== $candidate.steps.length) {
                hideFab();
            }
        }
    }, [prevGroup, prevSteps, prevSelected, $candidate.steps, $candidate.group, $candidate.selected]);

    const ids = candidates.map(({ _id }) => _id);
    const selectedInColumn = [...$candidate.selected.keys()].filter((cid) => ids.includes(cid));
    const enabled =
        selectedInColumn.length &&
        ($user.info.isCaptain ||
            ($candidate.steps.length === 2 ? $user.info.isCaptain : $candidate.group === $user.info.group));
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

export default FabButton;
