import React, { FC, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { SlideProps } from '@material-ui/core/Slide';

import { removeCandidate } from '../apis/websocket';
import Board from '../components/Board';
import Dialog from '../components/Dialog';
import Fab from '../components/Fab';
import Modal from '../components/Modal';
import Slider from '../components/Slider';
import Template from '../components/SMS';
import { STEPS } from '../config/consts';
import { Candidate } from '../config/types';
import { useStores } from '../hooks/useStores';
import { teamSort } from '../utils/sortBySlot';

const Candidates: FC = observer(() => {
    const { $component, $candidate } = useStores();
    const [dialog, setDialog] = useState(false);
    const [modal, setModal] = useState(false);
    const [step, setStep] = useState(0);
    const [index, setIndex] = useState(-1);
    const [direction, setDirection] = useState<SlideProps['direction']>('left');

    const candidates: Candidate[][] = [...new Array(STEPS.length)].map(() => []);
    if ($candidate.steps.length !== 2) {
        // 全部面板
        for (const candidate of $candidate.candidates) {
            if (candidate.group === $candidate.group) {
                candidates[candidate.step].push(candidate);
            }
        }
    } else {
        // 群面面板
        for (const candidate of $candidate.candidates) {
            if (candidate.step === $candidate.steps[0] || candidate.step === $candidate.steps[1]) {
                // 位于群面或通过
                candidates[candidate.step].push(candidate);
            }
        }
        // it's unnecessary to reassign because Array.prototype.sort is in-place
        candidates.map((toSort) => toSort.sort(teamSort));
    }

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
        $candidate.selected.forEach(({ _id }) => removeCandidate(_id));
    };

    const toggleOpen = (name: string) => () => {
        modal && $candidate.deselectAll();
        if (name === 'modal') setModal((prevModal) => !prevModal);
        if (name === 'dialog') setDialog((prevDialog) => !prevDialog);
    };

    return (
        <>
            <Board candidates={candidates} toggleDetail={toggleDetail} />
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
                        candidate={candidates[step][index]}
                        handleLeft={handleLeft}
                        handleRight={handleRight}
                        handleNextIndex={handleNextIndex}
                    />
                )}
            </Modal>
        </>
    );
});

export default Candidates;
