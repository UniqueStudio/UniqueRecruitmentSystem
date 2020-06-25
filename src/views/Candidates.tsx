import React, { FC, memo, useState } from 'react';

import { SlideProps } from '@material-ui/core/Slide';

import Dialog from '../components/Dialog';
import Modal from '../components/Modal';

import Board from '../containers/Board';
import { Props } from '../containers/Candidates';
import Fab from '../containers/Fab';
import Slider from '../containers/Slider';
import Template from '../containers/SMS';

const Candidates: FC<Props> = memo(({ selected, candidates, fabOn, selectedInfo, deselect, enqueueSnackbar, remove }) => {
    const [dialog, setDialog] = useState(false);
    const [modal, setModal] = useState(false);
    const [step, setStep] = useState(0);
    const [index, setIndex] = useState(-1);
    const [direction, setDirection] = useState<SlideProps['direction']>('left');
    const [todo, setTodo] = useState(-1);
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

    const toggleOpen = (name: string) => () => {
        modal && deselect(selected);
        if (name === 'modal') setModal((prevModal) => !prevModal);
        if (name === 'dialog') setDialog((prevDialog) => !prevDialog);
    };

    const handleRemove = (toRemove: string[]) => () => {
        toggleOpen('dialog')();
        if (toRemove.length === 0) {
            enqueueSnackbar('你没有选中任何人', { variant: 'info' });
            return;
        }
        toRemove.map((cid) => remove(cid));
    };

    const handleTodo = () => {
        setIndex(todo);
    };

    return (
        <>
            <Board candidates={candidates} toggleDetail={toggleDetail} />
            <Fab candidates={candidates[fabOn] || []} toggleOpen={toggleOpen} />
            <Dialog
                open={dialog}
                onClick={handleRemove(selected)}
                toggleOpen={toggleOpen('dialog')}
                title='提醒'
                content='这将永远移除该候选人，你确定吗？'
                yes='确定移除'
            />
            <Modal open={modal} onClose={toggleOpen('modal')} title='发送通知'>
                <Template toggleOpen={toggleOpen('modal')} selected={selectedInfo} deselect={deselect} />
            </Modal>
            <Modal open={index >= 0} onClose={toggleDetail(0)(-1)} direction={direction} title='详细信息'>
                {step >= 0 && <Slider
                    index={index}
                    candidate={candidates[step][index]}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    handleTodo={handleTodo}
                />}
            </Modal>
        </>
    );
});

export default Candidates;
