import React, { FC, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';

import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Candidate } from '../../config/types';

import Comments from '../../components/Comments';
import Detail from '../../components/Detail';

import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/slider';

interface Props {
    index: number;
    candidate: Candidate;
    handlePrev: (index: number) => void;
    handleNext: (index: number) => void;
    handleTodo: () => void;
}

const Slider: FC<Props> = observer(({ candidate: candidateP, handleTodo, handlePrev, handleNext, index }) => {
    const { componentStateStore } = useStores();
    const [candidate, setCandidate] = useState(candidateP);
    useEffect(() => {
        setCandidate((prevCandidate) => candidate || prevCandidate);
        return handleTodo;
    }, [candidate]);
    const classes = useStyles();

    const { _id: cid, comments } = candidate;

    const handleClick = (type: string) => () => {
        componentStateStore.recordInputtingComment(2, '');
        type === 'prev' ? handlePrev(index) : handleNext(index);
    };
    return (
        <div className={classes.detailContent}>
            <IconButton className={classes.leftButton} onClick={handleClick('prev')}>
                <ExpandMoreIcon />
            </IconButton>
            <div className={classes.detailMain}>
                <Detail info={candidate} />
                <Comments cid={cid} comments={comments} />
            </div>
            <IconButton className={classes.rightButton} onClick={handleClick('next')}>
                <ExpandMoreIcon />
            </IconButton>
        </div>
    );
});

export default Slider;
