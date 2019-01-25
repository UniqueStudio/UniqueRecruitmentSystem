import React, { PureComponent } from 'react';

import { InjectedNotistackProps } from 'notistack';

import Board from 'Components/Board';
import Dialog from 'Components/Dialog';
import Fab from 'Components/Fab';
import Modal from 'Components/Modal';
import { STEPS } from 'Config/consts';
import { Candidate, Step, User } from 'Config/types';
import Detail from 'Containers/Detail';
import Template from 'Containers/SMS';
import sortBySlot from 'Utils/sortBySlot';

interface Props {
    group: string;
    userInfo: User;
    candidates: Candidate[];
    selected: string[];
    fabOn: number;
    steps: Step[];
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    toggleFabOff: () => void;
    move: (from: number, to: number, cid: string, position: number) => void;
    remove: (cid: string) => void;
    enqueueSnackbar: InjectedNotistackProps['enqueueSnackbar'];
}

class Candidates extends PureComponent<Props> {

    state = {
        dialog: false,
        modal: false,
        step: -1,
        index: -1,
        direction: 'left' as 'left',
        todo: () => undefined
    };

    divideSteps = (candidates: Candidate[], shouldSpread = false) => {
        let candidateInSteps = STEPS.map((_, i) => candidates.filter(({ step }) => step === i));
        if (candidateInSteps.length === 2) {
            candidateInSteps = candidateInSteps.map((toSort) => toSort.sort(sortBySlot));
        }
        if (shouldSpread) {
            candidateInSteps = candidateInSteps.map((toSpread) => ({ ...toSpread }));
        }
        return candidateInSteps;
    };

    handleNext = (index: number) => {
        const { candidates } = this.props;
        const { step } = this.state;
        this.setState({
            direction: 'left',
            index: -1,
            todo: () => this.setState({
                index: index + 1 === this.divideSteps(candidates)[step].length ? -1 : index + 1
            }, () => this.setState({
                todo: () => undefined
            }))
        });
    };

    handlePrev = (index: number) => {
        this.setState({
            direction: 'right',
            index: -1,
            todo: () => this.setState({
                index: Math.max(index - 1, -1)
            }, () => this.setState({
                todo: () => undefined
            }))
        });
    };

    handleTodo = () => {
        this.state.todo();
    };

    toggleDetail = (step: number) => (index: number) => () => {
        this.setState({
            step,
            index,
        });
    };

    handleRemove = (selected: string[]) => () => {
        this.toggleOpen('dialog')();
        const { enqueueSnackbar, remove } = this.props;
        if (selected.length === 0) {
            enqueueSnackbar('你没有选中任何人');
            return;
        }
        selected.map((cid) => remove(cid));
    };

    toggleOpen = (name: string) => () => {
        const { deselect, selected } = this.props;
        this.state.modal && deselect(selected);
        this.setState((state) => ({
            [name]: !state[name],
        }));
    };

    render() {
        const { state, props, toggleOpen, handleRemove, handleNext, handlePrev, toggleDetail, divideSteps, handleTodo } = this;
        const { selected, candidates, fabOn, select, deselect, toggleFabOff, group, userInfo, move, steps } = props;
        const { modal, dialog, step, index, direction } = state;
        if (!candidates) {
            return null;
        }
        const candidatesInGroup = candidates.filter((candidate) => candidate.group === group);
        const selectedInfo = selected.map((id) => candidatesInGroup.find(({ _id }) => id === _id)) as Candidate[];
        const candidatesInSteps = divideSteps(candidatesInGroup);
        return (
            <>
                <Board move={move} steps={steps} candidates={candidatesInSteps} toggleDetail={toggleDetail} />
                <Fab selected={selected} deselect={deselect} fabOn={fabOn} select={select}
                     candidates={candidatesInSteps[fabOn] || []} toggleFabOff={toggleFabOff}
                     toggleOpen={toggleOpen} canOperate={userInfo.group === group} />
                <Dialog
                    open={dialog}
                    onClick={handleRemove(selected)}
                    toggleOpen={toggleOpen('dialog')}
                    title='提醒'
                    content='这将永远移除该候选人，你确定吗？'
                    yes='确定移除'
                />
                <Modal open={modal} onClose={toggleOpen('modal')} title='发送通知'>
                    <Template
                        toggleOpen={toggleOpen('modal')}
                        selected={selectedInfo}
                        deselect={deselect}
                    />
                </Modal>
                <Modal open={index >= 0} onClose={toggleDetail(0)(-1)} direction={direction} title='详细信息'>
                    {step >= 0 && <Detail
                        index={index}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        candidate={candidatesInSteps[step][index]}
                        handleTodo={handleTodo}
                    />}
                </Modal>
            </>
        );
    }
}

export default Candidates;
