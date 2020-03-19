import React, { FC, memo, useEffect, useState } from 'react';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';

import RemoveIcon from 'mdi-material-ui/AccountRemove';
import CloseIcon from 'mdi-material-ui/EyeOff';
import SelectAllIcon from 'mdi-material-ui/SelectAll';
import SelectInverseIcon from 'mdi-material-ui/SelectInverse';
import SendIcon from 'mdi-material-ui/Send';

import { Props } from '../../containers/Fab';

import { usePrevious } from '../../hooks/usePrevious';

import useStyles from '../../styles/fab';

const ButtonGenerator = (content: string, icon: JSX.Element, onClick: () => void, disabled = false) => (
    <SpeedDialAction
        icon={icon}
        FabProps={{ disabled }}
        tooltipTitle={content}
        onClick={onClick}
    />
);

const FabButton: FC<Props> = memo(({ candidates, selected, fabOn, canOperate, deselect, toggleFabOff, group, steps, select, toggleOpen }) => {
    const classes = useStyles();
    const [fabOpen, setFabOpen] = useState(false);

    const prevGroup = usePrevious(group);
    const prevSelected = usePrevious(selected);
    const prevSteps = usePrevious(steps);

    const handleSelectAll = (all: string[]) => () => {
        select(all.filter((cid) => selectable(cid)));
    };

    const handleInverse = (all: string[], toDeselect: string[]) => () => {
        deselect(toDeselect.filter((cid) => selectable(cid)));
        select(all.filter((cid) => !toDeselect.includes(cid) && selectable(cid)));
    };

    const selectable = (cid: string) => {
        const candidate = candidates.find(({ _id }) => _id === cid);
        return candidate && !(candidate.abandon || candidate.rejected);
    };

    const hideFab = () => {
        deselect(selected);
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
            if (prevSelected.length !== 0 && selected.length === 0) {
                toggleFabOff();
                closeFab();
            }
            if (prevGroup !== group || prevSteps.length !== steps.length) {
                hideFab();
            }
        }
        // eslint-disable-next-line
    }, [prevGroup, prevSteps, prevSelected, steps, group, selected, toggleFabOff]);

    const ids = candidates.map(({ _id }) => _id);
    const selectedInColumn = selected.filter((cid) => ids.includes(cid));
    const disabled = !selectedInColumn.length || !canOperate;
    return (
        <SpeedDial
            ariaLabel='fab'
            className={classes.fab}
            hidden={fabOn === -1}
            icon={<SpeedDialIcon />}
            onBlur={closeFab}
            onClick={toggleFabButtons}
            onClose={closeFab}
            onFocus={openFab}
            onMouseEnter={openFab}
            onMouseLeave={closeFab}
            open={fabOpen}
        >
            {ButtonGenerator('隐藏Fab', <CloseIcon />, hideFab)}
            {ButtonGenerator('移除', <RemoveIcon />, confirmRemove, disabled)}
            {ButtonGenerator('发送通知', <SendIcon />, sendNotification, disabled)}
            {ButtonGenerator('反选', <SelectInverseIcon />, handleInverse(ids, selectedInColumn))}
            {ButtonGenerator('全选', <SelectAllIcon />, handleSelectAll(ids))}
        </SpeedDial>
    );
});

export default FabButton;
