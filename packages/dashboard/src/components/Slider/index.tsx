import { IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';

import Comments from '@components/Comments';
import Detail from '@components/Detail';
import { Candidate } from '@config/types';
import { usePrevious } from '@hooks/usePrevious';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/slider';

interface Props {
    index: number;
    candidate: Candidate;
    handleLeft: () => void;
    handleRight: () => void;
    handleNextIndex: (index: number) => void;
}

enum Direction {
    L,
    R,
}

const Slider: FC<Props> = observer(({ candidate, handleNextIndex, handleLeft, handleRight, index }) => {
    const { $component } = useStores();
    const prevCandidate = usePrevious(candidate);
    const [nextIndex, setNextIndex] = useState(-1);
    useEffect(
        () => () => {
            index < 0 && handleNextIndex(nextIndex);
        },
        [index],
    );
    const classes = useStyles();

    const { _id: cid, comments } = candidate || prevCandidate;

    const handleClick = (type: Direction) => () => {
        $component.recordInputtingComment(2, '');
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
            <IconButton className={classes.leftButton} onClick={handleClick(Direction.L)}>
                <ExpandMoreIcon />
            </IconButton>
            <div className={classes.detailMain}>
                <Detail info={candidate || prevCandidate} />
                <Comments cid={cid} comments={comments} />
            </div>
            <IconButton className={classes.rightButton} onClick={handleClick(Direction.R)}>
                <ExpandMoreIcon />
            </IconButton>
        </div>
    );
});

export default Slider;
