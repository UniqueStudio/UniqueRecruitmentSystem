import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/template';

import Verify from '../../container/Verify';
import Picker from './Picker';
import SMSDetail from './SMSDetail';

import { Candidate, STEPS } from '../../lib/const';

interface Props extends WithStyles {
    group: string;
    status: string;
    pendingRecruitment: string;
    selected: Candidate[];
    toggleSnackbar: (info: string, color?: string) => void;
    toggleOpen: () => void;
    deselect: (cid: string) => void;
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

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.selected !== prevState.selected) {
            return {
                selected: nextProps.selected,
            };
        }
        if (nextProps.status === 'success' && prevState.sent) {
            return {
                activeStep: prevState.activeStep + 1,
                sent: false,
            };
        }
        return null;
    }

    state: State = {
        selected: this.props.selected,
        activeStep: 0,
        type: 'accept',
        step: '{{xx流程}}',
        time: '',
        place: '',
        rest: '',
        code: '',
        sent: false,
    };
    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
            sent: false,
        });
    };
    sendSMS = () => {
        const { selected, type, step, code, time, place, rest } = this.state;
        const { toggleSnackbar, group, pendingRecruitment } = this.props;
        if (code === '') {
            toggleSnackbar('未填写验证码！');
            return;
        }
        const content = {
            candidates: selected.map((candidate) => candidate._id),
            type,
            step,
            code,
            rest,
            group: group.toLowerCase(),
            title: pendingRecruitment,
        };
        if ((step === STEPS[0] || step === STEPS[2]) && type === 'accept') {
            content['time'] = time;
            content['place'] = place;
        }
        this.setState({
            code: '',
            sent: true,
        });
        this.props.sendSMS(content);
    };

    handleNext = () => {
        const { activeStep, step, type, time, place, rest } = this.state;
        const { toggleSnackbar } = this.props;
        if (activeStep === 1) {
            if (step === '{{xx流程}}') {
                toggleSnackbar('请选择流程！');
                return;
            } else if ((step === STEPS[0] || step === STEPS[2]) && type === 'accept' && !rest) {
                if (!time) {
                    toggleSnackbar('请填写时间！');
                    return;
                }
                if (!place) {
                    toggleSnackbar('请填写地点！');
                    return;
                }
            }
        }
        this.setState({
            activeStep: activeStep + 1,
        });
    };

    handleDelete = (cid: string) => {
        this.setState({
            selected: this.state.selected.filter(({ _id }) => _id !== cid),
        });
        this.props.deselect(cid);
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target['value'],
        });
    };

    render() {
        const { classes, toggleOpen, group } = this.props;
        const { activeStep, selected, step, type, code, time, place, rest } = this.state;
        const steps = ['发送对象', '消息模板', '确认发送'];
        const stepContent = [
            <Picker selected={selected} onDelete={this.handleDelete} />,
            <SMSDetail
                step={step}
                type={type}
                group={group}
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
                                    <Button variant='contained'
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
                        <Button onClick={this.handleBack} className={classes.templateItem}>上一步</Button>
                        <Button variant='contained' color='primary' onClick={toggleOpen}
                                className={classes.templateItem}>关闭</Button>
                    </Paper>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(Template);
