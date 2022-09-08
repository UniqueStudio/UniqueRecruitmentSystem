import { Button, Step as MuiStep, StepContent, StepLabel, Stepper } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import { SMSDetail } from './Detail';
import { SMSPicker } from './Picker';

import { sendSMSToCandidate } from '@apis/rest';
import { Verify } from '@components/Verify';
import { SMSType, Status } from '@config/enums';
import { SMSTemplate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/sms';
import { applySMSTemplate } from '@utils/applySMSTemplate';

interface Props {
    toggleOpen: () => void;
}

export const Template: FC<Props> = observer(({ toggleOpen }) => {
    const { $component, $application } = useStores();
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [content, setContent] = useState<SMSTemplate>({ type: SMSType.accept });
    const [code, setCode] = useState('');
    const message = applySMSTemplate(content);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSend = async () => {
        if (code === '') {
            $component.enqueueSnackbar('请填写验证码', Status.warning);
            return;
        }
        if (await sendSMSToCandidate({ ...content, code, aids: [...$application.selected.keys()] })) {
            toggleOpen();
        } else {
            setCode('');
        }
    };

    const handleNext = () => {
        if (activeStep === 1 && message.includes('{{!')) {
            $component.enqueueSnackbar('请完整填写模板', Status.warning);
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChange =
        (name: keyof SMSTemplate): ChangeEventHandler<HTMLInputElement> =>
        ({ target: { value } }) => {
            // `value` is defined as string but can be number here
            setContent((prevContent) => ({ ...prevContent, [name]: value }));
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
