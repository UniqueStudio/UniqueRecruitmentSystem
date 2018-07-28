import * as React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import TemplateStepOne from './TemplateStepOne';
import TemplateStepTwo from './TemplateStepTwo';
import TemplateStepThree from './TemplateStepThree';

interface CandidateInfo {
    cid: string;
    name: string;
    grade: string;
    institute: string;
}

interface Props extends WithStyles {
    group: string;
    flowStep: string;
    selected: CandidateInfo[];
    toggleOpen: () => void;
    deselect: (cid: string) => void;
}

class Template extends React.PureComponent<Props> {
    state = {
        selected: this.props.selected,
        activeStep: 0
    };

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            selected: nextProps.selected
        })
    }

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

    handleDelete = (cid: string) => {
        this.setState({
            selected: this.state.selected.filter(i => i.cid !== cid)
        });
        this.props.deselect(cid);
    };

    render() {
        const { classes, deselect, toggleOpen, flowStep, group } = this.props;
        const { activeStep, selected } = this.state;
        const steps = ['发送对象', '消息模板', '确认发送'];
        const stepContent = [
            <TemplateStepOne selected={selected} deselect={deselect} onDelete={this.handleDelete} />,
            <TemplateStepTwo step={flowStep} group={group} />,
            <TemplateStepThree/>,
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
                                            {activeStep ? '上一步': '关闭'}
                                        </Button>
                                        <Button variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
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


