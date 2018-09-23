import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import TemplateStepOne from './TemplateStepOne';
import TemplateStepTwo from './TemplateStepTwo';
import Verify from '../../container/Verify';
import { Candidate, STEP, Time } from '../../lib/const';

interface Props extends WithStyles {
    group: string;
    status: string;
    toggleSnackbar: (info: string, color?: string) => void;
    selected: Candidate[];
    toggleOpen: () => void;
    deselect: (cid: string) => void;
    sendSMS: (content: object) => void;
}

interface State {
    selected: Candidate[];
    activeStep: number;
    type: string;
    step: string;
    date: Time[];
    time: string;
    place: string;
    rest: string,
    code: string;
    sent: boolean;
}

class Template extends PureComponent<Props> {
    defaultDate = {
        date: new Date().toISOString().slice(0, 10),
        morning: false,
        afternoon: false,
        evening: false
    };

    state: State = {
        selected: this.props.selected,
        activeStep: 0,
        type: 'accept',
        step: '{{xx流程}}',
        date: [{ ...this.defaultDate }],
        time: '',
        place: '',
        rest: '',
        code: '',
        sent: false
    };
    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
            sent: false
        });
    };

    handleNext = () => {
        const { activeStep, step, date, type, time, place, rest } = this.state;
        const { toggleSnackbar } = this.props;
        if (activeStep === 1) {
            if (step === '{{xx流程}}') {
                toggleSnackbar('请选择流程！');
                return;
            } else if ((step === STEP[1] || step === STEP[3]) && type === 'accept') {
                for (const i of date) {
                    if (!(i.afternoon || i.morning || i.evening)) {
                        toggleSnackbar('请选择正确的时间段！');
                        return;
                    }
                }
            } else if ((step === STEP[0] || step === STEP[2]) && type === 'accept' && !rest) {
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

    sendSMS = () => {
        const { selected, type, step, date, code, time, place, rest } = this.state;
        const { toggleSnackbar, group } = this.props;
        if (code === '') {
            toggleSnackbar('未填写验证码！');
            return;
        }
        const content = {
            candidates: selected.map(i => i._id),
            type,
            step,
            code,
            rest,
            group: group.toLowerCase(),
            title: '2018A'
        };
        if ((step === STEP[1] || step === STEP[3]) && type === 'accept') {
            content['date'] = date;
        }
        if ((step === STEP[0] || step === STEP[2]) && type === 'accept') {
            content['time'] = time;
            content['place'] = place;
        }
        this.props.sendSMS(content);
        this.setState({
            code: '',
            sent: true
        });
    };

    handleDelete = (cid: string) => {
        this.setState({
            selected: this.state.selected.filter(i => i._id !== cid)
        });
        this.props.deselect(cid);
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target['value'],
        });
    };

    changeDate = (id: number) => (event: React.ChangeEvent) => {
        const copiedDate = [...this.state.date];
        copiedDate[id]['date'] = event.target['value'];
        this.setState({
            date: copiedDate
        })
    };

    setTime = (id: number) => (event: React.ChangeEvent) => {
        const time = event.target['value'];
        const copiedDate = [...this.state.date];
        copiedDate[id][time] = !copiedDate[id][time];
        this.setState({
            date: copiedDate
        })
    };

    addDate = () => {
        this.setState({
            date: [...this.state.date, { ...this.defaultDate }]
        })
    };

    deleteDate = (id: number) => () => {
        const copiedDate = [...this.state.date];
        copiedDate.splice(id, 1);
        this.setState({
            date: copiedDate
        })
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.selected !== prevState.selected) {
            return {
                selected: nextProps.selected
            };
        }
        if (nextProps.status === 'success' && prevState.sent) {
            return {
                activeStep: prevState.activeStep + 1,
            };
        }
        return null;
    }

    render() {
        const { classes, toggleOpen, group } = this.props;
        const { activeStep, selected, step, type, date, code, time, place, rest } = this.state;
        const steps = ['发送对象', '消息模板', '确认发送'];
        const stepContent = [
            <TemplateStepOne selected={selected} onDelete={this.handleDelete} />,
            <TemplateStepTwo
                step={step}
                type={type}
                date={date}
                group={group}
                time={time}
                place={place}
                rest={rest}
                fns={{
                    handleChange: this.handleChange,
                    changeDate: this.changeDate,
                    setTime: this.setTime,
                    addDate: this.addDate,
                    deleteDate: this.deleteDate
                }} />,
            <Verify onChange={this.handleChange('code')} code={code} />,
        ];

        return (
            <div className={classes.template}>
                <Stepper activeStep={activeStep} classes={{ root: classes.stepper }} orientation="vertical">
                    {steps.map((i, j) => (
                        <Step key={j}>
                            <StepLabel>{i}</StepLabel>
                            <StepContent classes={{
                                last: classes.verify
                            }}>
                                {stepContent[j]}
                                <div>
                                    <Button
                                        onClick={activeStep ? this.handleBack : toggleOpen}
                                        className={classes.templateItem}
                                    >
                                        {activeStep ? '上一步' : '关闭'}
                                    </Button>
                                    <Button variant="contained"
                                            color="primary"
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
                        <Button variant="contained" color="primary" onClick={toggleOpen}
                                className={classes.templateItem}>关闭</Button>
                    </Paper>
                )}
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Template));


