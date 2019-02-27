import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { OptionsObject } from 'notistack';

import styles from '../../styles/template';

import Verify from '../../containers/Verify';
import Picker from './Picker';
import SMSDetail from './SMSDetail';

import { Candidate } from '../../config/types';

interface Props extends WithStyles {
    status: string;
    selected: Candidate[];
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
    toggleOpen: () => void;
    deselect?: (cid: string) => void;
    sendSMS: (content: object) => void;
}

interface State {
    selected: Candidate[];
    activeStep: number;
    type: string;
    step: string;
    time: string;
    place: string;
    rest: string;
    code: string;
    sent: boolean;
}

class Template extends PureComponent<Props> {

    state = {
        selected: this.props.selected,
        activeStep: 0,
        type: 'accept',
        step: -1 as -1,
        next: -1 as -1,
        time: '',
        place: '',
        rest: '',
        code: '',
    };

    handleBack = () => {
        this.setState(({ activeStep }: State) => ({
            activeStep: activeStep - 1,
        }));
    };

    sendSMS = () => {
        const { selected, type, step, code, time, place, rest, next } = this.state;
        const { enqueueSnackbar, sendSMS } = this.props;
        if (code === '') {
            enqueueSnackbar('请填写验证码！');
            return;
        }
        const content = {
            candidates: selected.map(({ _id }) => _id),
            type,
            step,
            next,
            code,
            rest,
            time,
            place,
        };
        this.setState({
            code: '',
        });
        sendSMS(content);
    };

    handleNext = () => {
        const { activeStep, step, type, time, place, rest, next } = this.state;
        const { enqueueSnackbar } = this.props;
        if (activeStep === 1) {
            if (type === 'group' || type === 'team') {
                if (!place) {
                    enqueueSnackbar('请填写地点！');
                    return;
                }
            } else if (step === -1) {
                enqueueSnackbar('请选择流程！');
                return;
            } else if (next === -1) {
                enqueueSnackbar('请选择下一轮！');
                return;
            } else if ((next === 1 || next === 3) && type === 'accept' && !rest) {
                if (!time) {
                    enqueueSnackbar('请填写时间！');
                    return;
                }
                if (!place) {
                    enqueueSnackbar('请填写地点！');
                    return;
                }
            }
        }
        this.setState((state: State) => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleDelete = (cid: string) => () => {
        const { deselect } = this.props;
        this.setState((state: State) => ({
            selected: state.selected.filter(({ _id }) => _id !== cid),
        }));
        deselect && deselect(cid);
    };

    handleChange = (name: string) => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [name]: value,
        });
    };

    render() {
        const { classes, toggleOpen } = this.props;
        const { activeStep, selected, step, type, code, time, place, rest, next } = this.state;
        const steps = ['发送对象', '消息模板', '确认发送'];
        const stepContent = [
            <Picker selected={selected} onDelete={this.handleDelete} />,
            <SMSDetail
                step={step}
                next={next}
                type={type}
                time={time}
                place={place}
                rest={rest}
                handleChange={this.handleChange}
            />,
            <Verify onChange={this.handleChange('code')} code={code} />,
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
                                    <Button
                                        onClick={activeStep ? this.handleBack : toggleOpen}
                                        className={classes.templateItem}
                                    >
                                        {activeStep ? '上一步' : '关闭'}
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={activeStep === steps.length - 1 ? this.sendSMS : this.handleNext}
                                        className={classes.templateItem}
                                        disabled={selected.length === 0}
                                    >
                                        {activeStep === steps.length - 1 ? '发送通知' : '下一步'}
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.templateEnd}>
                        <Button
                            onClick={this.handleBack}
                            className={classes.templateItem}
                        >上一步</Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={toggleOpen}
                            className={classes.templateItem}
                        >关闭</Button>
                    </Paper>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(Template);
