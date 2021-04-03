import { SlideProps } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { removeCandidate } from '@apis/rest';
import { Board } from '@components/Board';
import { Comments } from '@components/Comments';
import { Detail } from '@components/Detail';
import { Dialog } from '@components/Dialog';
import { Fab } from '@components/Fab';
import { Modal } from '@components/Modal';
import { Slider } from '@components/Slider';
import { Template } from '@components/SMS';
import { StepType } from '@config/enums';
import { Candidate } from '@config/types';
import { usePrevious } from '@hooks/usePrevious';
import { useStores } from '@hooks/useStores';

const Candidate: FC<{ candidate: Candidate }> = ({ candidate }) => {
    const prevCandidate = usePrevious(candidate);
    candidate = candidate || prevCandidate;
    return (
        <>
            <Detail candidate={candidate} />
            <Comments candidate={candidate} />
        </>
    );
};

const Candidates: FC = observer(() => {
    const { $component, $candidate } = useStores();
    const [dialog, setDialog] = useState(false);
    const [modal, setModal] = useState(false);
    const [step, setStep] = useState(0);
    const [index, setIndex] = useState(-1);
    const [direction, setDirection] = useState<SlideProps['direction']>('left');
    useEffect(() => {
        $candidate.setSteps(StepType.all);
    }, []);

    const candidates = $candidate.groupBySteps;

    const handleRight = () => {
        setDirection('left');
        setIndex(-1);
    };

    const handleLeft = () => {
        setDirection('right');
        setIndex(-1);
    };

    const handleNextIndex = (newIndex: number) => {
        if (newIndex >= candidates[step].length || newIndex < 0) {
            setIndex(-1);
        } else {
            setIndex(newIndex);
        }
    };

    const toggleDetail = (newStep: number) => (newIndex: number) => () => {
        setStep(newStep);
        setIndex(newIndex);
    };

    const handleRemove = () => {
        toggleOpen('dialog')();
        if ($candidate.selected.size === 0) {
            $component.enqueueSnackbar('你没有选中任何人', 'info');
            return;
        }
        $candidate.selected.forEach(({ id }) => void removeCandidate(id));
    };

    const toggleOpen = (name: string) => () => {
        modal && $candidate.deselectAll();
        if (name === 'modal') setModal((prevModal) => !prevModal);
        if (name === 'dialog') setDialog((prevDialog) => !prevDialog);
    };

    return (
        <>
            {useMemo(
                () => (
                    <Board candidates={candidates} toggleDetail={toggleDetail} />
                ),
                [candidates],
            )}
            <Fab candidates={candidates[$component.fabOn] || []} toggleOpen={toggleOpen} />
            <Dialog
                open={dialog}
                onClick={handleRemove}
                toggleOpen={toggleOpen('dialog')}
                title='提醒'
                content='这将永远移除该候选人，你确定吗？'
                yes='确定移除'
            />
            <Modal open={modal} onClose={toggleOpen('modal')} title='发送通知'>
                <Template toggleOpen={toggleOpen('modal')} />
            </Modal>
            <Modal open={index >= 0} onClose={toggleDetail(0)(-1)} direction={direction} title='详细信息'>
                {step >= 0 && (
                    <Slider
                        index={index}
                        handleLeft={handleLeft}
                        handleRight={handleRight}
                        handleNextIndex={handleNextIndex}>
                        <Candidate candidate={candidates[step][index]} />
                    </Slider>
                )}
            </Modal>
        </>
    );
});

export default Candidates;
