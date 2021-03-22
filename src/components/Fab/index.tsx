import React, { FC, useEffect, useState } from 'react';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';

import RemoveIcon from 'mdi-material-ui/AccountRemove';
import CloseIcon from 'mdi-material-ui/EyeOff';
import SelectAllIcon from 'mdi-material-ui/SelectAll';
import SelectInverseIcon from 'mdi-material-ui/SelectInverse';
import SendIcon from 'mdi-material-ui/Send';

import { observer } from 'mobx-react-lite';
import { Candidate } from '../../config/types';
import { usePrevious } from '../../hooks/usePrevious';
import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/fab';

const ButtonGenerator = (content: string, icon: JSX.Element, onClick: () => void, disabled = false) => (
    <SpeedDialAction icon={icon} FabProps={{ disabled }} tooltipTitle={content} onClick={onClick} />
);

interface Props {
    candidates: Candidate[];
    toggleOpen: (component: string) => () => void;
}

const FabButton: FC<Props> = observer(({ candidates, toggleOpen }) => {
    const { componentStateStore, candidateStore, userStore } = useStores();
    const classes = useStyles();
    const [fabOpen, setFabOpen] = useState(false);

    const prevGroup = usePrevious(candidateStore.group);
    const prevSelected = usePrevious(candidateStore.selected);
    const prevSteps = usePrevious(candidateStore.steps);

    const handleSelectAll = (all: string[]) => () => {
        candidateStore.selectCandidates(all.filter((cid) => selectable(cid)));
    };

    const handleInverse = (all: string[], toDeselect: string[]) => () => {
        candidateStore.deselectCandidates(toDeselect.filter((cid) => selectable(cid)));
        candidateStore.selectCandidates(all.filter((cid) => !toDeselect.includes(cid) && selectable(cid)));
    };

    const selectable = (cid: string) => {
        const candidate = candidates.find(({ _id }) => _id === cid);
        return candidate && !(candidate.abandon || candidate.rejected);
    };

    const hideFab = () => {
        candidateStore.deselectCandidates(candidateStore.selected);
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

    useEffect(() => {
        if (prevSelected !== undefined && prevSteps !== undefined && prevGroup !== undefined) {
            if (prevSelected.length !== 0 && candidateStore.selected.length === 0) {
                componentStateStore.toggleFabOff();
                closeFab();
            }
            if (prevGroup !== candidateStore.group || prevSteps.length !== candidateStore.steps.length) {
                hideFab();
            }
        }
    }, [prevGroup, prevSteps, prevSelected, candidateStore.steps, candidateStore.group, candidateStore.selected]);

    const ids = candidates.map(({ _id }) => _id);
    const selectedInColumn = candidateStore.selected.filter((cid) => ids.includes(cid));
    const enabled =
        selectedInColumn.length &&
        (userStore.info.isCaptain ||
            (candidateStore.steps.length === 2
                ? userStore.info.isCaptain
                : candidateStore.group === userStore.info.group));
    return (
        <SpeedDial
            ariaLabel='fab'
            className={classes.fab}
            hidden={componentStateStore.fabOn === -1}
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
            {ButtonGenerator('发送通知', <SendIcon />, sendNotification, !enabled)}
            {ButtonGenerator('反选', <SelectInverseIcon />, handleInverse(ids, selectedInColumn))}
            {ButtonGenerator('全选', <SelectAllIcon />, handleSelectAll(ids))}
        </SpeedDial>
    );
});

export default FabButton;
