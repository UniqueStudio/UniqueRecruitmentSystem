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
    const { componentStateStore, candidateStore } = useStores();
    const [dialog, setDialog] = useState(false);
    const [modal, setModal] = useState(false);
    const [step, setStep] = useState(0);
    const [index, setIndex] = useState(-1);
    const [direction, setDirection] = useState<SlideProps['direction']>('left');
    const [todo, setTodo] = useState(-1);

    let candidates: Candidate[][] = [...new Array(STEPS.length)].map(() => []);
    const selectedInfo: Candidate[] = [];
    if (candidateStore.steps.length !== 2) {
        // 全部面板
        for (const candidate of candidateStore.candidates) {
            if (candidate.group === candidateStore.group) {
                candidates[candidate.step].push(candidate);
            }
            if (candidateStore.selected.includes(candidate._id)) {
                selectedInfo.push(candidate);
            }
        }
    } else {
        // 群面面板
        for (const candidate of candidateStore.candidates) {
            if (candidate.step === candidateStore.steps[0] || candidate.step === candidateStore.steps[1]) {
                // 位于群面或通过
                candidates[candidate.step].push(candidate);
            }
            if (candidateStore.selected.includes(candidate._id)) {
                selectedInfo.push(candidate);
            }
        }
        candidates = candidates.map((toSort) => toSort.sort(teamSort));
    }

    const handleNext = (current: number) => {
        setDirection('left');
        setIndex(-1);
        setTodo(current + 1 === candidates[step].length ? -1 : current + 1);
    };

    const handlePrev = (current: number) => {
        setDirection('right');
        setIndex(-1);
        setTodo(Math.max(current - 1, -1));
    };

    const toggleDetail = (newStep: number) => (newIndex: number) => () => {
        setStep(newStep);
        setIndex(newIndex);
        setTodo(-1);
    };

    const handleRemove = (toRemove: string[]) => () => {
        toggleOpen('dialog')();
        if (toRemove.length === 0) {
            componentStateStore.enqueueSnackbar('你没有选中任何人', 'info');
            return;
        }
        toRemove.forEach((cid) => removeCandidate(cid));
    };

    const toggleOpen = (name: string) => () => {
        modal && candidateStore.deselectCandidates(candidateStore.selected);
        if (name === 'modal') setModal((prevModal) => !prevModal);
        if (name === 'dialog') setDialog((prevDialog) => !prevDialog);
    };

    const handleTodo = () => {
        setIndex(todo);
    };

    return (
        <>
            <Board candidates={candidates} toggleDetail={toggleDetail} />
            <Fab candidates={candidates[componentStateStore.fabOn] || []} toggleOpen={toggleOpen} />
            <Dialog
                open={dialog}
                onClick={handleRemove(candidateStore.selected)}
                toggleOpen={toggleOpen('dialog')}
                title='提醒'
                content='这将永远移除该候选人，你确定吗？'
                yes='确定移除'
            />
            <Modal open={modal} onClose={toggleOpen('modal')} title='发送通知'>
                <Template toggleOpen={toggleOpen('modal')} selected={selectedInfo} deselect={true} />
            </Modal>
            <Modal open={index >= 0} onClose={toggleDetail(0)(-1)} direction={direction} title='详细信息'>
                {step >= 0 && (
                    <Slider
                        index={index}
                        candidate={candidates[step][index]}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        handleTodo={handleTodo}
                    />
                )}
            </Modal>
        </>
    );
});

export default Candidates;
