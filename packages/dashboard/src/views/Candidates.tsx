import React, { PureComponent } from 'react';

import { InjectedNotistackProps } from 'notistack';

import Board from '../components/Board';
import Dialog from '../components/Dialog';
import Fab from '../components/Fab';
import Modal from '../components/Modal';
import { STEPS } from '../config/consts';
import { Candidate, Step, User } from '../config/types';
import Detail from '../containers/Detail';
import Template from '../containers/SMS';
import { sortBySlot } from '../utils/sortBySlot';

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
    move: (from: Step, to: Step, cid: string, position: number) => void;
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

    componentDidUpdate(prevProps: Props) {
        const prev = prevProps.candidates.filter(({ step }) => step === this.state.step);
        const now = this.props.candidates.filter(({ step }) => step === this.state.step);
        if (prev.length !== now.length) {
            this.setState({
                index: -1
            });
        }
    }

    divideSteps = (candidates: Candidate[], shouldSpread = false) => {
        candidates = candidates.filter((candidate) => candidate.group === this.props.group);
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
        const { group: userGroup, isAdmin } = userInfo;
        const candidatesInSteps = divideSteps(candidates);
        const candidatesInGroup = candidates.filter((candidate) => candidate.group === group);
        const selectedInfo = selected.map((id) => candidatesInGroup.find(({ _id }) => id === _id)) as Candidate[];
        return (
            <>
                <Board move={move} steps={steps} candidates={candidatesInSteps} toggleDetail={toggleDetail} />
                <Fab selected={selected} deselect={deselect} fabOn={fabOn} select={select}
                     candidates={candidatesInSteps[fabOn] || []} toggleFabOff={toggleFabOff}
                     toggleOpen={toggleOpen} canOperate={userGroup === group || isAdmin} />
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
