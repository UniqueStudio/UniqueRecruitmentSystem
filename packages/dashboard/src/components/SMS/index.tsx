import { Button, Paper, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import Detail from './Detail';
import Picker from './Picker';

import { sendSMS } from '@apis/rest';
import Verify from '@components/Verify';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/sms';

interface Props {
    toggleOpen: () => void;
}

const SMSTemplate: FC<Props> = observer(({ toggleOpen }) => {
    const { $component, $candidate } = useStores();
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [content, setContent] = useState({
        type: 'accept',
        step: -1 as -1,
        next: -1 as -1,
        time: '',
        place: '',
        rest: '',
    });
    const [code, setCode] = useState('');

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSend = () => {
        if (code === '') {
            $component.enqueueSnackbar('请填写验证码！', 'warning');
            return;
        }

        setCode('');
        return sendSMS({ ...content, code, candidates: [...$candidate.selected.keys()] });
    };

    const handleNext = () => {
        const { step, type, time, place, rest, next } = content;
        if (activeStep === 1) {
            if (type === 'group' || type === 'team') {
                if (!place) {
                    $component.enqueueSnackbar('请填写地点！', 'warning');
                    return;
                }
            } else if (step === -1) {
                $component.enqueueSnackbar('请选择流程！', 'warning');
                return;
            } else if (next === -1) {
                $component.enqueueSnackbar('请选择下一轮！', 'warning');
                return;
            } else if ((next === 1 || next === 3) && type === 'accept' && !rest) {
                if (!time) {
                    $component.enqueueSnackbar('请填写时间！', 'warning');
                    return;
                }
                if (!place) {
                    $component.enqueueSnackbar('请填写地点！', 'warning');
                    return;
                }
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChange = (name: string): ChangeEventHandler<HTMLInputElement> => ({ target: { value } }) => {
        // `value` is defined as string but can be number here
        setContent((prevContent) => ({ ...prevContent, [name]: value }));
    };

    const handleCode: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setCode(value);
    };

    const steps = ['发送对象', '消息模板', '确认发送'];
    const stepContent = [
        <Picker />,
        <Detail content={content} handleChange={handleChange} />,
        <Verify code={code} onChange={handleCode} />,
    ];

    return (
        <div className={classes.template}>
            <Stepper activeStep={activeStep} classes={{ root: classes.stepper }} orientation='vertical'>
                {steps.map((stepName, index) => (
                    <Step key={index}>
                        <StepLabel>{stepName}</StepLabel>
                        <StepContent classes={{ last: classes.verify }}>
                            {stepContent[index]}
                            <div>
                                <Button onClick={activeStep ? handleBack : toggleOpen} className={classes.templateItem}>
                                    {activeStep ? '上一步' : '关闭'}
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={activeStep === steps.length - 1 ? handleSend : handleNext}
                                    className={classes.templateItem}
                                    disabled={$candidate.selected.size === 0}>
                                    {activeStep === steps.length - 1 ? '发送通知' : '下一步'}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.templateEnd}>
                    <Button onClick={handleBack} className={classes.templateItem}>
                        上一步
                    </Button>
                    <Button variant='contained' color='primary' onClick={toggleOpen} className={classes.templateItem}>
                        关闭
                    </Button>
                </Paper>
            )}
        </div>
    );
});

export default SMSTemplate;
