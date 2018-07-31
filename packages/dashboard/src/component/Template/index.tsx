import * as React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import TemplateStepOne from './TemplateStepOne';
import TemplateStepTwo from './TemplateStepTwo';
import TemplateStepThree from './TemplateStepThree';

export interface CandidateInfo {
    cid: string;
    name: string;
    grade: string;
    institute: string;
}

interface Props extends WithStyles {
    group: string;
    toggleSnackbar: (info: string, color?: string) => void;
    selected: CandidateInfo[];
    toggleOpen: () => void;
    deselect: (cid: string) => void;
    sendSMS: (content: object) => void;
}

class Template extends React.PureComponent<Props> {
    defaultDate = {
        date: new Date().toISOString().slice(0, 10),
        morning: false,
        afternoon: false,
        evening: false
    };

    state = {
        selected: this.props.selected,
        activeStep: 0,
        model: 'accept',
        step: '{{xx流程}}',
        date: [{ ...this.defaultDate }],
        code: ''
    };

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            selected: nextProps.selected
        })
    }

    handleNext = () => {
        const { activeStep, step, date, model } = this.state;
        const { toggleSnackbar } = this.props;
        if (activeStep === 1) {
            if (step === '{{xx流程}}') {
                toggleSnackbar('请选择流程！');
                return;
            } else if ((step === '笔试流程' || step === '熬测流程') && model === 'accept') {
                for (const i of date) {
                    if (!(i.afternoon || i.morning || i.evening)) {
                        toggleSnackbar('请选择时间段！');
                        return;
                    }
                }
            }
        }
        this.setState({
            activeStep: activeStep + 1,
        });
    };

    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    };

    handleDelete = (cid: string) => {
        this.setState({
            selected: this.state.selected.filter(i => i.cid !== cid)
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

    sendSMS = () => {
        const { selected, model, step, date, code } = this.state;
        const { toggleSnackbar, group } = this.props;
        if (code === '') {
            toggleSnackbar('未填写验证码！');
            return;
        }
        const content = {
            candidates: selected.map(i => i.cid),
            model,
            step,
            code,
            group: group.toLowerCase(),
            title: '2018A'
        };
        if ((step === '笔试流程' || step === '熬测流程') && model === 'accept') {
            content['date'] = date;
        }
        this.setState({
            code: ''
        });
        this.props.sendSMS(content);
        this.handleNext();
    };

    render() {
        const { classes, toggleOpen, group } = this.props;
        const { activeStep, selected } = this.state;
        const steps = ['发送对象', '消息模板', '确认发送'];
        const stepContent = [
            <TemplateStepOne selected={selected} onDelete={this.handleDelete} />,
            <TemplateStepTwo
                step={this.state.step}
                model={this.state.model}
                date={this.state.date}
                group={group}
                fns={{
                    handleChange: this.handleChange,
                    changeDate: this.changeDate,
                    setTime: this.setTime,
                    addDate: this.addDate,
                    deleteDate: this.deleteDate
                }} />,
            <TemplateStepThree onChange={this.handleChange} />,
        ];

        return (
            <div className={classes.template}>
                <Stepper activeStep={activeStep} classes={{ root: classes.stepper }} orientation="vertical">
                    {steps.map((i, j) => {
                        return (
                            <Step key={j}>
                                <StepLabel>{i}</StepLabel>
                                <StepContent>
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
                        );
                    })}
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


