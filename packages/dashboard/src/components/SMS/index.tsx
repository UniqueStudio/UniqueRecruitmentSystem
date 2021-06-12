import { Button, Step as MuiStep, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import { SMSDetail } from './Detail';
import { SMSPicker } from './Picker';

import { sendSMSToCandidate } from '@apis/rest';
import { Verify } from '@components/Verify';
import { SMSType } from '@config/enums';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/sms';
import { generateModel } from '@utils/generateModel';

interface Props {
    toggleOpen: () => void;
}

const initialContent = {
    type: SMSType.accept,
    next: -1!,
    time: '',
    place: '',
    rest: '',
};

export const Template: FC<Props> = observer(({ toggleOpen }) => {
    const { $component, $application } = useStores();
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [content, setContent] = useState(initialContent);
    const [message, setMessage] = useState(generateModel(initialContent));
    const [code, setCode] = useState('');

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSend = async () => {
        if (code === '') {
            $component.enqueueSnackbar('请填写验证码', 'warning');
            return;
        }

        if (await sendSMSToCandidate({ ...content, code, aids: [...$application.selected.keys()] })) {
            setCode('');
        }
    };

    const handleNext = () => {
        if (activeStep === 1 && message.includes('{{!')) {
            $component.enqueueSnackbar('请完整填写模板', 'warning');
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChange =
        (name: string): ChangeEventHandler<HTMLInputElement> =>
        ({ target: { value } }) => {
            // `value` is defined as string but can be number here
            setContent((prevContent) => {
                const newContent = { ...prevContent, [name]: value };
                setMessage(generateModel(newContent));
                return newContent;
            });
        };

    const handleCode: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setCode(value);
    };

    const steps = ['发送对象', '消息模板', '确认发送'];
    const stepContent = {
        0: <SMSPicker />,
        1: <SMSDetail content={content} handleChange={handleChange} message={message} />,
        2: <Verify code={code} onChange={handleCode} />,
    };

    return (
        <Stepper activeStep={activeStep} className={classes.template} orientation='vertical'>
            {steps.map((stepName, index) => (
                <MuiStep key={index}>
                    <StepLabel>{stepName}</StepLabel>
                    <StepContent classes={{ last: classes.lastStep }}>
                        {stepContent[index]}
                        <Button
                            color='inherit'
                            onClick={activeStep ? handleBack : toggleOpen}
                            className={classes.templateItem}
                        >
                            {activeStep ? '上一步' : '关闭'}
                        </Button>
                        <Button
                            variant='contained'
                            onClick={activeStep === steps.length - 1 ? handleSend : handleNext}
                            className={classes.templateItem}
                            disabled={$application.selected.size === 0}
                        >
                            {activeStep === steps.length - 1 ? '发送通知' : '下一步'}
                        </Button>
                    </StepContent>
                </MuiStep>
            ))}
        </Stepper>
    );
});
