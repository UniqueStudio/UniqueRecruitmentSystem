import React, { PureComponent } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';

import FlashOn from '@material-ui/icons/FlashOn';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Female from 'mdi-material-ui/GenderFemale';
import Male from 'mdi-material-ui/GenderMale';
import TransGender from 'mdi-material-ui/GenderTransgender';

import { GRADES } from '../../config/consts';
import { Candidate as CandidateType, Evaluation } from '../../config/types';
import { colorToAlpha, dangerColor, successColor, warningColor } from '../../styles';
import styles from '../../styles/candidate';

interface Props extends WithStyles<typeof styles> {
    candidate: CandidateType;
    provided: DraggableProvided;
    isTeamInterview: boolean;
    selected: string[];
    fabOn: number;
    select: (cid: string) => void;
    deselect: (cid: string) => void;
    changeInputting: (content: string, evaluation: Evaluation) => void;
    toggleFabOn: (step: number) => void;
    toggleDetail: () => void;
}

const generateStyle = (evaluations: Evaluation[]) => {
    const red = colorToAlpha(dangerColor, 0.1);
    const yellow = colorToAlpha(warningColor, 0.1);
    const green = colorToAlpha(successColor, 0.1);
    const G_Y = evaluations.filter((evaluation) => evaluation === 2).length / evaluations.length * 100; // good
    const Y_R = evaluations.filter((evaluation) => evaluation === 1).length / evaluations.length * 100 + G_Y; // so-so
    return `linear-gradient(to right, ${green}, ${green} ${G_Y}%, ${yellow} ${G_Y}%, ${yellow} ${Y_R}%, ${red} ${Y_R}%, ${red})`;
};

class Candidate extends PureComponent<Props> {
    state = {
        checked: false,
        anchorEl: undefined,
    };

    handleOpen = ({ currentTarget }: React.MouseEvent) => {
        this.setState({ anchorEl: currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    };

    handleCheck = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
        const { candidate: { _id, step }, toggleFabOn, select, deselect } = this.props;
        this.setState({
            checked,
        });
        if (checked) {
            select(_id);
            toggleFabOn(step);
        } else {
            deselect(_id);
        }
    };

    handleToggle = () => {
        const { toggleDetail, changeInputting } = this.props;
        toggleDetail();
        changeInputting('', 2);
    };

    stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    render() {
        const { candidate, selected, classes, provided, fabOn, isTeamInterview } = this.props;
        const { name, grade, institute, comments, abandon, rejected, gender, group, interviews, step, _id, isQuick } = candidate;
        const { allocation } = interviews.team;
        const { innerRef, draggableProps, dragHandleProps } = provided;
        const evaluations = comments.map((comment) => comment.evaluation);
        const style = generateStyle(evaluations);
        const coloredPanelStyle = {
            background: abandon ? 'rgba(0, 0, 0, 0.1)' : !evaluations.length ? 'rgba(0, 0, 0, 0)' : style,
        };
        const card = (
            <div
                onMouseOver={this.handleOpen}
                onMouseOut={this.handleClose}
                ref={innerRef}
                className={classes.cardContainer}
                {...draggableProps}
                {...dragHandleProps}
            >
                <Card className={classes.card} style={coloredPanelStyle} onClick={this.handleToggle}>
                    <div className={classes.cardContent}>
                        <Checkbox
                            color='primary'
                            onClick={this.stopPropagation}
                            onChange={this.handleCheck}
                            checked={selected.includes(_id)}
                            disabled={abandon || rejected || (selected.length !== 0 && fabOn !== step)}
                        />
                        <span className={classes.cardTitle}>
                            <Typography variant='h6'>
                                {(isTeamInterview ? `${group} - ` : '') + name}
                                <span className={classes.svg}>
                                    {[<TransGender nativeColor={orange[500]} />, <Male nativeColor={blue[500]} />, <Female nativeColor={pink[500]} />][gender]}
                                    {isQuick && <FlashOn nativeColor={amber[500]} />}
                                </span>
                            </Typography>
                            <Typography color='textSecondary' variant='caption'>{
                                `${GRADES[grade]} - ${institute}`
                            }</Typography>
                            {allocation && isTeamInterview && <Typography color='textSecondary' variant='caption'>{
                                new Date(allocation).toLocaleString('zh-CN', { hour12: false })
                            }</Typography>}
                        </span>
                        <IconButton
                            className={classes.iconButton}
                            onClick={this.handleToggle}
                        >
                            <InfoIcon />
                        </IconButton>
                        {/* this div is used to get avoid of default style on :last-child */}
                        <div style={{ position: 'absolute' }} />
                    </div>
                </Card>
            </div>
        );
        const popover = (
            <Popover
                className={classes.popper}
                classes={{ paper: classes.popperRoot }}
                open={Boolean(this.state.anchorEl)}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={this.handleClose}
                disableRestoreFocus
            >{abandon ? '该选手已放弃' : rejected ? '该选手已被淘汰' : ''}</Popover>
        );
        return <>
            {card}
            {abandon || rejected ? popover : null}
        </>;
    }
}

export default withStyles(styles)(Candidate);
