import * as React from "react";
import {
    Checkbox,
    IconButton,
    WithStyles,
    withStyles, Typography, Card, Tooltip
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon, InfoOutline as InfoIcon } from "@material-ui/icons";

import Modal from '../Modal';
import Detail from './CandidateDetail';
import Comments from '../../container/CandidateComments';

import styles, { warningColor, dangerColor, successColor, colorToAlpha } from "../../style";
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
    step: string;
    uid: string;
    info: Info;
    selected: string[];
    modalOpen: boolean;
    direction: string;
    select: (uid: string) => void;
    deselect: (uid: string) => void;
    onNext: () => void;
    onPrev: () => void;
    connectDragSource: (content: any) => any;
    connectDragPreview: (content: any) => any;
}

const candidateSource = {
    beginDrag(props: Props) {
        return { step: props.step, uid: props.uid };
    }
};

const collect = ((connect: any, monitor: any) => {
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

    handleMenuOpen = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: undefined });
    };

    toggleModalOpen = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleCheck = (event: React.ChangeEvent) => {
        this.setState({
            checked: event.target['checked']
        });
        event.target['checked'] ? this.props.select(this.props.uid) : this.props.deselect(this.props.uid);
    };

    render() {
        const { step, uid, info, selected, classes, direction, connectDragSource } = this.props;
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
            <div>
                <Tooltip title={abandon ? '该选手已放弃' : ''}>
                    <Card className={classes.card} style={coloredPanelStyle}>
                        <div className={classes.cardContent}>
                            <Checkbox
                                color='primary'
                                onChange={this.handleCheck}
                                checked={selected.includes(uid)}
                                disabled={abandon}
                            />
                            <span>
                            <Typography variant='title'>{name}</Typography>
                            <Typography color='textSecondary' variant='caption'>{`${grade} - ${institute}`}</Typography>
                        </span>
                            <IconButton className={classes.iconButton}
                                        onClick={this.toggleModalOpen/*this.handleMenuOpen*/}>
                                <InfoIcon />
                            </IconButton>
                            {/* this div is used to get avoid of default style on :last-child */}
                            <div style={{ position: 'absolute' }} />
                        </div>
                    </Card>
                </Tooltip>
            </div>
        );
        return (
            <>
                {abandon ? card : connectDragSource(card)}
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
                        <Detail name={name} />
                        <Comments step={step} uid={uid} comments={comments} />
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
