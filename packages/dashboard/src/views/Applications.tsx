import { SlideProps } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { removeApplication } from '@apis/rest';
import { Board } from '@components/Board';
import { Comments } from '@components/Comments';
import { Detail } from '@components/Detail';
import { Dialog } from '@components/Dialog';
import { Fab } from '@components/Fab';
import { Modal } from '@components/Modal';
import { Slider } from '@components/Slider';
import { Template } from '@components/SMS';
import { StepType } from '@config/enums';
import { Application } from '@config/types';
import { usePrevious } from '@hooks/usePrevious';
import { useStores } from '@hooks/useStores';

const SliderContent: FC<{ application?: Application }> = ({ application }) => {
    const prevApplication = usePrevious(application)!;
    application = application ?? prevApplication;
    return (
        <>
            <Detail application={application} />
            <Comments application={application} />
        </>
    );
};

const Applications: FC = observer(() => {
    const { $component, $application } = useStores();
    const [dialog, setDialog] = useState(false);
    const [modal, setModal] = useState(false);
    const [step, setStep] = useState(0);
    const [index, setIndex] = useState(-1);
    const [direction, setDirection] = useState<SlideProps['direction']>('right');

    useEffect(() => $application.setSteps(StepType.all), []);

    const applications = $application.groupBySteps;

    const handleRight = () => {
        setDirection('left');
        setIndex(-1);
    };

    const handleLeft = () => {
        setDirection('right');
        setIndex(-1);
    };

    const handleNextIndex = (index: number) => setIndex(applications[step][index] ? index : -1);

    const toggleDetail = (newStep: number, newIndex: number) => () => {
        setStep(newStep);
        setIndex(newIndex);
    };

    const handleRemove = () => {
        toggleOpen('dialog')();
        if ($application.selected.size === 0) {
            $component.enqueueSnackbar('你没有选中任何人', 'info');
            return;
        }
        $application.selected.forEach(({ id }) => void removeApplication(id));
    };

    const toggleOpen = (name: string) => () => {
        if (modal) {
            $application.deselectAll();
        }
        if (name === 'modal') {
            setModal((prevModal) => !prevModal);
        }
        if (name === 'dialog') {
            setDialog((prevDialog) => !prevDialog);
        }
    };

    return (
        <>
            {useMemo(
                () => (
                    <Board applications={applications} toggleDetail={toggleDetail} />
                ),
                [applications],
            )}
            <Fab applications={applications[$component.fabOn] ?? []} toggleOpen={toggleOpen} />
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
            <Modal open={index >= 0} onClose={handleLeft} direction={direction} title='详细信息'>
                <Slider
                    index={index}
                    handleLeft={handleLeft}
                    handleRight={handleRight}
                    handleNextIndex={handleNextIndex}
                >
                    <SliderContent application={applications[step][index]} />
                </Slider>
            </Modal>
        </>
    );
});

export default Applications;
