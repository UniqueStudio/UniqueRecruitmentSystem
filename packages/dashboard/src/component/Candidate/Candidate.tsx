import * as React from "react";
import {
    Checkbox,
    IconButton,
    WithStyles,
    withStyles, ListItemSecondaryAction, ListItemText, ListItem
} from "@material-ui/core";
import { InfoOutline as InfoIcon } from "@material-ui/icons";

import Modal from '../Modal';
import Detail from './CandidateDetail';

import styles from "../../style";
import { warningColor, dangerColor, successColor, colorToAlpha } from '../../style';
import withRoot from "../../style/withRoot";
import Comments from '../../container/CandidateComments';

interface Props extends WithStyles {
    step: string;
    name: string;
    grade: string;
    institute: string;
    comments: object;
    selected: string[];
    select: (name: string) => void;
    deselect: (name: string) => void;
}

class Candidate extends React.Component<Props> {
    state = {
        expanded: false,
        evaluation: "",
        comment: "",
        checked: false,
        anchorEl: undefined,
        modalOpen: false,
    };

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
        event.target['checked'] ? this.props.select(this.props.name) : this.props.deselect(this.props.name);
    };

    render() {
        const { step, name, grade, institute, comments, selected, classes } = this.props;
        const evaluations = Object.values(comments).map(i => i['evaluation']);
        const red = colorToAlpha(dangerColor, 0.1),
            yellow = colorToAlpha(warningColor, 0.1),
            green = colorToAlpha(successColor, 0.1);
        const yellowP = evaluations.filter(i => i === 'so-so').length / evaluations.length * 100,
            greenP = evaluations.filter(i => i === 'good').length / evaluations.length * 100;
        const coloredPanelStyle = {
            background: evaluations.length === 0 ? 'white' : `linear-gradient(to right, ${green}, ${green} ${greenP}%, ${yellow} ${greenP}%, ${yellow} ${greenP + yellowP}%, ${red} ${greenP + yellowP}%, ${red})`
        };
        return (
            <>
                {/*<Card className={classes.card}>*/}
                {/*<ExpansionPanelSummary style={coloredPanelStyle}>*/}
                {/*<Checkbox checked={selected.includes(name)}*/}
                {/*onChange={this.handleCheck}*/}
                {/*color='primary'*/}
                {/*classes={{ root: classes.cornerChecker }}*/}
                {/*/>*/}
                {/*<span>*/}
                {/*<Typography variant='title'>{name}</Typography>*/}
                {/*<Typography color='textSecondary'>{`${grade} - ${institute}`}</Typography>*/}
                {/*</span>*/}
                {/*<IconButton className={classes.iconButton} onClick={this.toggleModalOpen/*this.handleMenuOpen*!/>*/}
                {/*<InfoIcon />*/}
                {/*</IconButton>*/}
                {/*{*/}
                {/*/**/}
                {/*<Menu*/}
                {/*anchorEl={this.state.anchorEl}*/}
                {/*open={Boolean(this.state.anchorEl)}*/}
                {/*onClose={this.handleMenuClose}*/}
                {/*>*/}
                {/*<MenuItem onClick={e => {*/}
                {/*this.handleMenuClose(e);*/}
                {/*this.toggleModalOpen(e);*/}
                {/*}}>详细信息</MenuItem>*/}
                {/*</Menu>*/}

                {/*/!* this div is used to get avoid of default style on :last-child *!/*/}
                {/*<div style={{ position: 'absolute' }} />*/}
                {/*</ExpansionPanelSummary>*/}
                {/*</Card>*/}
                <div className={classes.card}>
                    <ListItem style={coloredPanelStyle}>
                        <Checkbox
                            color='primary'
                            onChange={this.handleCheck}
                            checked={selected.includes(name)}
                            classes={{ root: classes.cornerChecker }}
                        />
                        <ListItemText primary={name} secondary={`${grade} - ${institute}`} />
                        <ListItemSecondaryAction>
                            <IconButton className={classes.iconButton}
                                        onClick={this.toggleModalOpen/*this.handleMenuOpen*/}>
                                <InfoIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>
                <Modal open={this.state.modalOpen} onClose={this.toggleModalOpen} title='详细信息'>
                    <div className={classes.modalContent}>
                        <Detail />
                        <Comments step={step} name={name} comments={comments} />
                    </div>
                </Modal>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
