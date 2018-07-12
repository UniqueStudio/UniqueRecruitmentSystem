import * as React from 'react';
import {
    Button,
    Chip,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../style/index'
import withRoot from '../style/withRoot';

interface Props extends WithStyles {
    selected: string[];
    flow: string;
    toggleOpen: () => void;
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

    handleDelete = (candidate: string) => () => {
        this.setState({
            selected: this.state.selected.filter(i => i !== candidate)
        })
    };

    render() {
        const { classes } = this.props;
        const { activeStep, selected } = this.state;
        const steps = ['发送对象', '消息模板', '模板参数'];
        const stepContent = [
            <div className={classes.templateContent}>
                {selected.map(i => <Chip
                    key={i}
                    label={i}
                    onDelete={this.handleDelete(i)}
                    className={classes.templateChip}
                />)}
            </div>,
            <div>222</div>,
            <div>333</div>,
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
                                        <div>
                                            <Button disabled={activeStep === 0} onClick={this.handleBack}>上一步</Button>
                                            <Button variant="contained" color="primary" onClick={this.handleNext}>
                                                {activeStep === steps.length - 1 ? '发送' : '下一步'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.templateEnd}>
                        <Typography variant='title'>已成功发送短信!</Typography>
                        <Button variant="contained" color="primary" onClick={this.props.toggleOpen}>关闭</Button>
                    </Paper>
                )}
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Template));


