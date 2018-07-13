import * as React from 'react';
import {
    Button,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import TemplateStepOne from './TemplateStepOne';
import TemplateStepTwo from './TemplateStepTwo';
import TemplateStepThree from './TemplateStepThree';

interface CandidateInfo {
    uid: string;
    name: string;
    grade: string;
    institute: string;
}

interface Props extends WithStyles {
    group: string;
    flowStep: string;
    selected: CandidateInfo[];
    toggleOpen: () => void;
    deselect: (uid: string) => void;
}

class Template extends React.Component<Props> {
    state = {
        selected: this.props.selected,
        activeStep: 0
    };

    handleNext = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        });
    };

    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    };

    handleDelete = (uid: string) => {
        this.setState({
            selected: this.state.selected.filter(i => i.uid !== uid)
        });
        this.props.deselect(uid);
    };

    render() {
        const { classes, deselect, toggleOpen, flowStep, group } = this.props;
        const { activeStep, selected } = this.state;
        const steps = ['发送对象', '消息模板', '模板参数'];
        const stepContent = [
            <TemplateStepOne selected={selected} deselect={deselect} onDelete={this.handleDelete} />,
            <TemplateStepTwo />,
            <TemplateStepThree step={flowStep} group={group}/>,
        ];

        return (
            <div className={classes.template}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((i, j) => {
                        return (
                            <Step key={j}>
                                <StepLabel>{i}</StepLabel>
                                <StepContent>
                                    {stepContent[j]}
                                    <div>
                                        <Button
                                                onClick={selected.length ? this.handleBack : toggleOpen}
                                                className={classes.templateItem}
                                        >
                                            {activeStep ? '上一步': '关闭'}
                                        </Button>
                                        <Button variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                className={classes.templateItem}
                                                disabled={selected.length === 0}
                                        >
                                            {activeStep === steps.length - 1 ? '发送' : '下一步'}
                                        </Button>
                                    </div>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.templateEnd}>
                        <Typography variant='title'>已成功发送短信!</Typography>
                        <Button variant="contained" color="primary" onClick={toggleOpen}
                                className={classes.templateItem}>关闭</Button>
                    </Paper>
                )}
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Template));


