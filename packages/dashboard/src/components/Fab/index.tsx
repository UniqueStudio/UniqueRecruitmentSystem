import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/core';
import { Delete, SelectAll, ArrowBack, ArrowForward, Send } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactElement, useState } from 'react';

import { moveCandidate } from '@apis/rest';
import { SelectInverse } from '@components/Icons';
import { Step } from '@config/enums';
import { Application } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/fab';

const ButtonGenerator = (content: string, icon: ReactElement, onClick: () => void, disabled = false) => (
    <SpeedDialAction icon={icon} FabProps={{ disabled }} tooltipTitle={content} onClick={onClick} />
);

interface Props {
    candidates: Application[];
    toggleOpen: (component: string) => () => void;
}

const selectable = ({ abandoned, rejected }: Application) => !abandoned && !rejected;

export const Fab: FC<Props> = observer(({ candidates, toggleOpen }) => {
    const { $application, $user, $component } = useStores();
    const classes = useStyles();
    const [fabOpen, setFabOpen] = useState(false);

    const handleSelectAll = () => $application.selectMany(candidates.filter(selectable).map(({ id }) => id));

    const handleInverse = () => {
        const selected = [...$application.selected.keys()];
        $application.selectMany(candidates.filter(selectable).map(({ id }) => id));
        $application.deselectMany(selected);
    };

    const openFab = () => setFabOpen(true);

    const closeFab = () => setFabOpen(false);

    const changeProcess = (delta: -1 | 1) => () => {
        $application.selected.forEach(({ id, step }) => void moveCandidate(id, step, delta + step));
    };

    const disabled = !$application.selected.size || $application.group !== $user.info.group;

    return (
        <SpeedDial
            ariaLabel='fab'
            className={classes.fab}
            hidden={!$application.selected.size}
            icon={<SpeedDialIcon />}
            onClose={closeFab}
            onOpen={openFab}
            open={fabOpen && !!$application.selected.size}
        >
            {ButtonGenerator('移除', <Delete />, toggleOpen('dialog'), disabled || !$user.isAdminOrCaptain)}
            {ButtonGenerator('发送通知', <Send />, toggleOpen('modal'), disabled || !$user.isAdminOrCaptain)}
            {ButtonGenerator(
                '下一流程',
                <ArrowForward />,
                changeProcess(1),
                disabled || $component.fabOn === Step.通过,
            )}
            {ButtonGenerator('上一流程', <ArrowBack />, changeProcess(-1), disabled || $component.fabOn === Step.报名)}
            {ButtonGenerator('反选', <SelectInverse />, handleInverse)}
            {ButtonGenerator('全选', <SelectAll />, handleSelectAll)}
        </SpeedDial>
    );
});
