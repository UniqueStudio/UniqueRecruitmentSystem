import * as React from "react";
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { ExpandMore as ExpandMoreIcon, InfoOutline as InfoIcon } from "@material-ui/icons";

import Modal from '../Modal';
import Detail from './CandidateDetail';
import Comments from '../../container/Candidate/CandidateComments';

import styles, { colorToAlpha, dangerColor, successColor, warningColor } from "../../style";
import withRoot from "../../style/withRoot";
import { DragSource } from 'react-dnd';

interface Info {
    name: string;
    grade: string;
    institute: string;
    comments: object;
    abandon: boolean;
}

interface Props extends WithStyles {
    step: number;
    cid: string;
    info: Info;
    selected: string[];
    modalOpen: boolean;
    direction: string;
    select: (cid: string) => void;
    deselect: (cid: string) => void;
    onNext: () => void;
    onPrev: () => void;
    connectDragSource: (content: any) => any;
    connectDragPreview: (content: any) => any;
}

const candidateSource = {
    beginDrag(props: Props) {
        return { step: props.step, cid: props.cid };
    }
};

const collect = ((connect: any) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview()
    }
});

@DragSource('candidate', candidateSource, collect)
class Candidate extends React.Component<Props> {
    state = {
        expanded: false,
        evaluation: "",
        comment: "",
        checked: false,
        anchorEl: undefined,
        modalOpen: this.props.modalOpen,
    };

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            modalOpen: nextProps.modalOpen
        })
    }

    handleOpen = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleCheck = (event: React.ChangeEvent) => {
        this.setState({
            checked: event.target['checked']
        });
        event.target['checked'] ? this.props.select(this.props.cid) : this.props.deselect(this.props.cid);
    };

    render() {
        const { step, cid, info, selected, classes, direction, connectDragSource } = this.props;
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
                 onMouseOut={this.handleClose}>
                <Card className={classes.card} style={coloredPanelStyle}>
                    <div className={classes.cardContent}>
                        <Checkbox
                            color='primary'
                            onChange={this.handleCheck}
                            checked={selected.includes(cid)}
                            disabled={abandon}
                        />
                        <span>
                            <Typography variant='title'>{name}</Typography>
                            <Typography color='textSecondary' variant='caption'>{`${grade} - ${institute}`}</Typography>
                        </span>
                        <IconButton className={classes.iconButton}
                                    onClick={this.toggleModalOpen}>
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
                {abandon ? <>{card}{popover}</> : connectDragSource(card)}
                <Modal open={this.state.modalOpen}
                       onClose={this.toggleModalOpen}
                       direction={direction}
                       title='详细信息'
                >
                    <div className={classes.modalContent}>
                        <IconButton className={classes.leftButton} onClick={() => {
                            this.props.onPrev();
                        }}>
                            <ExpandMoreIcon />
                        </IconButton>
                        <div className={classes.modalMain}>
                            <Detail name={name} />
                            <Comments step={step} cid={cid} comments={comments} />
                        </div>
                        <IconButton className={classes.rightButton} onClick={() => {
                            this.props.onNext();
                        }}>
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
