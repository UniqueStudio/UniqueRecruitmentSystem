import React, { PureComponent } from "react";
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { DraggableProvided } from 'react-beautiful-dnd';

import styles from "../../style/candidate";
import { colorToAlpha, dangerColor, successColor, warningColor } from '../../style';
import withRoot from "../../style/withRoot";

interface Info {
    name: string;
    grade: string;
    institute: string;
    comments: object;
    abandon?: boolean;
}

interface Props extends WithStyles {
    provided: DraggableProvided;
    fabOn: number;
    step: number;
    cid: string;
    info: Info;
    selected: string[];
    select: (cid: string) => void;
    deselect: (cid: string) => void;
    toggleModalOn: (cid: string) => void;
    changeInputting: (comment: string, evaluation: string) => void;
    toggleFabOn: (step: number) => void;
}

class Candidate extends PureComponent<Props> {
    state = {
        checked: false,
        anchorEl: undefined,
    };

    handleOpen = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    };

    handleCheck = (event: React.ChangeEvent) => {
        const { cid, toggleFabOn, step, select, deselect } = this.props;
        this.setState({
            checked: event.target['checked']
        });
        if (event.target['checked']) {
            select(cid);
            toggleFabOn(step);
        } else {
            deselect(cid);
        }
    };

    render() {
        const { cid, info, selected, classes, toggleModalOn, changeInputting, provided, fabOn, step } = this.props;
        const { name, grade, institute, comments, abandon } = info;
        const evaluations = Object.values(comments).map(i => i['evaluation']);
        const red = colorToAlpha(dangerColor, 0.1),
            yellow = colorToAlpha(warningColor, 0.1),
            green = colorToAlpha(successColor, 0.1);
        const yellowP = evaluations.filter(i => i === 'so-so').length / evaluations.length * 100,
            greenP = evaluations.filter(i => i === 'good').length / evaluations.length * 100;
        const coloredPanelStyle = {
            background: abandon ? 'rgba(0, 0, 0, 0.1)' : evaluations.length === 0 ? 'rgba(0, 0, 0, 0)' : `linear-gradient(to right, ${green}, ${green} ${greenP}%, ${yellow} ${greenP}%, ${yellow} ${greenP + yellowP}%, ${red} ${greenP + yellowP}%, ${red})`
        };
        const card = (
            <div onMouseOver={this.handleOpen}
                 onMouseOut={this.handleClose}
                 ref={provided.innerRef}
                 className={classes.cardContainer}
                 {...provided.draggableProps}
                 {...provided.dragHandleProps}
            >
                <Card className={classes.card} style={coloredPanelStyle} onClick={() => {
                    toggleModalOn(cid);
                    changeInputting('', '');
                }}>
                    <div className={classes.cardContent}>
                        <Checkbox
                            color='primary'
                            onClick={e => e.stopPropagation()}
                            onChange={this.handleCheck}
                            checked={selected.includes(cid)}
                            disabled={abandon || (selected.length !== 0 && fabOn !== step)}
                        />
                        <span className={classes.cardTitle}>
                            <Typography variant='title'>{name}</Typography>
                            <Typography color='textSecondary' variant='caption'>{`${grade} - ${institute}`}</Typography>
                        </span>
                        <IconButton className={classes.iconButton}
                                    onClick={() => {
                                        toggleModalOn(cid);
                                        changeInputting('', '');
                                    }}>
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
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={this.handleClose}
                disableRestoreFocus
            >该选手已放弃</Popover>
        );
        return (
            <>
                {abandon ? <>{card}{popover}</> : card}
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
