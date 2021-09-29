import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';

import { Evaluation } from '@config/enums';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/slider';

interface Props {
    index: number;
    handleLeft: () => void;
    handleRight: () => void;
    handleNextIndex: (index: number) => void;
}

enum Direction {
    L,
    R,
}

export const Slider: FC<Props> = observer(({ handleNextIndex, handleLeft, handleRight, index, children }) => {
    const classes = useStyles();
    const { $component } = useStores();
    const [nextIndex, setNextIndex] = useState(-1);
    useEffect(
        () => () => {
            if (index < 0) {
                handleNextIndex(nextIndex);
            }
        },
        [index],
    );

    const handleClick = (type: Direction) => () => {
        $component.recordInputtingComment(Evaluation.fair, '');
        if (type === Direction.L) {
            handleLeft();
            setNextIndex(index - 1);
        } else {
            handleRight();
            setNextIndex(index + 1);
        }
    };
    return (
        <div className={classes.detailContent}>
            <IconButton className={classes.button} onClick={handleClick(Direction.L)}>
                <ChevronLeftIcon />
            </IconButton>
            <div className={classes.detailMain}>{children}</div>
            <IconButton className={classes.button} onClick={handleClick(Direction.R)}>
                <ChevronRightIcon />
            </IconButton>
        </div>
    );
});
